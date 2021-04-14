/*
 * Copyright (C) 2018 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import renderAssignmentsApp from './react/index'
import $ from 'jquery'

$(() => {
  renderAssignmentsApp(ENV, $('<div/>').appendTo('#content')[0])
})

import('@canvas/module-sequence-footer').then(() => {
  $(() => {
    $('<div id="module_sequence_footer" style="margin-top: 30px" />')
      .appendTo('#content')
      .moduleSequenceFooter({
        assetType: 'Assignment',
        assetID: ENV.ASSIGNMENT_ID,
        courseID: ENV.COURSE_ID
      })
  })
})