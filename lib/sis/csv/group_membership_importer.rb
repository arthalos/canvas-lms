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

module SIS
  module CSV
    class GroupMembershipImporter < CSVBaseImporter
      def self.group_membership_csv?(row)
        row.include?('group_id') && row.include?('user_id')
      end

      def self.identifying_fields
        %w[group_id user_id].freeze
      end

      # expected columns
      # group_id,user_id,status
      def process(csv, index = nil, count = nil)
        count = SIS::GroupMembershipImporter.new(@root_account, importer_opts).process do |importer|
          csv_rows(csv, index, count) do |row|
            importer.add_group_membership(row['user_id'], row['group_id'], row['status'])
          rescue ImportError => e
            SisBatch.add_error(csv, e.to_s, sis_batch: @batch, row: row['lineno'], row_info: row)
          end
        end
        count
      end
    end
  end
end
