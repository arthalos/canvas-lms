# frozen_string_literal: true

# Copyright (C) 2013 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.
#

describe Quizzes::QuizSubmissionHistory do
  context "submissions with history" do
    before :once do
      course_factory
      @quiz       = @course.quizzes.create!
      @submission = @quiz.quiz_submissions.new

      @submission.workflow_state = "complete"
      @submission.score = 5.0
      @submission.attempt = 1
      @submission.with_versioning(true, &:save!)

      # regrade 1
      @submission.score_before_regrade = 5.0
      @submission.score = 4.0
      @submission.attempt = 1
      @submission.with_versioning(true, &:save!)

      # new attempt
      @submission.score = 3.0
      @submission.attempt = 2
      @submission.with_versioning(true, &:save!)
    end

    describe "#initialize" do
      it "groups list of attempts for the quiz submission" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2
        expect(attempts.first).to be_a(Quizzes::QuizSubmissionAttempt)
      end

      it "sorts attempts sequentially" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2
        expect(attempts.map { |attempt| attempt.number }).to eq [1, 2]
      end
    end

    describe "#last_versions" do
      it "returns last versions for each attempt" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2

        versions = attempts.last_versions
        expect(versions.length).to eq 2
        expect(versions.first).to be_a(Version)
      end
    end

    describe "#version_models" do
      it "returns models for the latest versions" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2

        models = attempts.version_models
        expect(models.length).to eq 2
        expect(models.first).to be_a(Quizzes::QuizSubmission)
      end

      it "returns the submission itself as the latest attempt" do
        @submission.extra_attempts = 1
        @submission.save! # doesn't add a new version

        attempts = Quizzes::QuizSubmissionHistory.new(@submission)

        models = attempts.version_models
        expect(models.last.extra_attempts).to eq 1
      end
    end

    describe "#kept" do
      it "returns the version of the submission that was kept" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2

        models = attempts.version_models
        expect(models.length).to eq 2

        expect(attempts.kept).to eq models.first
      end
    end

    describe "#model_for" do
      it "returns model for the current attempt" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2

        qs = attempts.model_for(@submission.attempt)
        expect(qs.attempt).to eq 2
        expect(qs).to be_a(Quizzes::QuizSubmission)
      end

      it "returns model for previous attempts" do
        attempts = Quizzes::QuizSubmissionHistory.new(@submission)
        expect(attempts.length).to eq 2

        qs = attempts.model_for(1)
        expect(qs.attempt).to eq 1
        expect(qs).to be_a(Quizzes::QuizSubmission)
      end
    end
  end
end
