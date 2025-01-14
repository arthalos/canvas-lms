# frozen_string_literal: true

#
# Copyright (C) 2011 - present Instructure, Inc.
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

shared_examples_for "Canvas::DraftStateValidations" do
  describe ":validate_draft_state_change" do
    it "works" do
      subject.workflow_state = 'unpublished'
      allow(subject).to receive_messages(has_student_submissions?: true)
      allow(subject).to receive_messages(workflow_state_changed?: true)
      allow(subject).to receive_messages({
                                           changes: { 'workflow_state' => ['published', 'unpublished'] }
                                         })
      subject.save

      expect(subject.errors[:workflow_state]).to be_present
      expect(subject.errors[:workflow_state][0].to_s).to match(
        %r{can't unpublish if there are student submissions}i
      )
    end
  end
end
