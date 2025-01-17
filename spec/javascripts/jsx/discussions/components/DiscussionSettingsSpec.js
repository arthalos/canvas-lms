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

import React from 'react'
import {mount, shallow} from 'enzyme'
import merge from 'lodash/merge'
import $ from 'jquery'

import DiscussionSettings from 'ui/features/discussion_topics_index/react/components/DiscussionSettings'

QUnit.module('DiscussionSettings component', suiteHooks => {
  let tree

  suiteHooks.afterEach(() => {
    tree.unmount()
  })

  const makeProps = (props = {}) =>
    merge(
      {
        courseSettings: {
          allow_student_discussion_topics: true,
          allow_student_forum_attachments: true,
          allow_student_discussion_editing: true,
          allow_student_discussion_reporting: true,
          grading_standard_enabled: false,
          grading_standard_id: null,
          allow_student_organized_groups: true,
          hide_final_grades: false
        },
        userSettings: {
          markAsRead: false,
          collapse_global_nav: false
        },
        isSavingSettings: false,
        isSettingsModalOpen: true,
        permissions: {change_settings: false},
        saveSettings() {},
        toggleModalOpen() {},
        applicationElement: () => document.getElementById('fixtures')
      },
      props
    )

  suiteHooks.beforeEach(() => {
    ENV = {
      student_reporting_enabled: true
    }
  })

  test('should render discussion settings', () => {
    tree = mount(<DiscussionSettings {...makeProps()} />)
    const node = tree.find('#discussion_settings')
    ok(node.exists())
  })

  test('should call open modal when discussion settings is clicked', () => {
    const modalOpenSpy = sinon.spy()
    tree = mount(<DiscussionSettings {...makeProps({toggleModalOpen: modalOpenSpy})} />)
    tree.find('Button').at(0).simulate('click')
    equal(modalOpenSpy.callCount, 1)
  })

  test('should find 4 checked boxes', () => {
    tree = mount(
      <DiscussionSettings
        {...makeProps({
          permissions: {change_settings: true}
        })}
      />
    )
    equal(document.querySelectorAll('[checked]').length, 4)
  })

  test('should find 0 checked boxes', () => {
    tree = mount(
      <DiscussionSettings
        {...makeProps({
          permissions: {change_settings: true},
          courseSettings: {
            allow_student_discussion_topics: false,
            allow_student_forum_attachments: false,
            allow_student_discussion_editing: false,
            allow_student_discussion_reporting: false
          }
        })}
      />
    )

    equal(document.querySelectorAll('[checked]').length, 0)
  })

  test('should render one checkbox if can not change settings', () => {
    tree = shallow(<DiscussionSettings {...makeProps({isSettingsModalOpen: true})} />)
    const checkboxes = tree.find('Checkbox')
    equal(checkboxes.length, 1)
  })

  test('should render 5 checkbox if can change settings', () => {
    tree = shallow(
      <DiscussionSettings
        {...makeProps({isSettingsModalOpen: true, permissions: {change_settings: true}})}
      />
    )
    const checkboxes = tree.find('Checkbox')
    equal(checkboxes.length, 5)
  })

  test('should set state correctly with all true settings', () => {
    tree = shallow(
      <DiscussionSettings
        {...makeProps({isSettingsModalOpen: true, permissions: {change_settings: true}})}
      />
    )
    tree.setProps({isSavingSettings: false})
    equal(tree.instance().state.studentSettings.length, 4)
  })

  test('should set state correctly with false props', () => {
    tree = shallow(
      <DiscussionSettings
        {...makeProps({isSettingsModalOpen: true, permissions: {change_settings: true}})}
      />
    )
    tree.setProps({
      courseSettings: {
        allow_student_discussion_topics: true,
        allow_student_forum_attachments: false,
        allow_student_discussion_editing: false
      }
    })
    ok(tree.instance().state.studentSettings.includes('allow_student_discussion_topics'))
  })

  test('will call save settings when button is clicked with correct args', () => {
    const saveSpy = sinon.spy()
    tree = mount(
      <DiscussionSettings
        {...makeProps({
          saveSettings: saveSpy,
          isSettingsModalOpen: true,
          permissions: {change_settings: true}
        })}
      />
    )
    const courseSettings = {
      allow_student_discussion_topics: true,
      allow_student_forum_attachments: true,
      allow_student_discussion_editing: true,
      allow_student_discussion_reporting: true
    }
    const userSettings = {
      markAsRead: false,
      collapse_global_nav: false
    }
    tree.setProps({userSettings, courseSettings})
    $('#submit_discussion_settings').click()
    deepEqual(saveSpy.args[0][1], courseSettings)
  })

  test('will call save settings when button is clicked with correct args round 2', () => {
    const saveSpy = sinon.spy()
    tree = mount(
      <DiscussionSettings
        {...makeProps({
          saveSettings: saveSpy,
          isSettingsModalOpen: true,
          permissions: {change_settings: true}
        })}
      />
    )
    const courseSettings = {
      allow_student_discussion_topics: true,
      allow_student_forum_attachments: false,
      allow_student_discussion_editing: true,
      allow_student_discussion_reporting: false
    }
    const userSettings = {
      markAsRead: false,
      collapse_global_nav: false
    }
    tree.setProps({userSettings, courseSettings})
    $('#submit_discussion_settings').click()
    deepEqual(saveSpy.args[0][1], courseSettings)
  })

  test('will render spinner when issaving is set', () => {
    tree = shallow(
      <DiscussionSettings
        {...makeProps({
          isSavingSettings: true,
          isSettingsModalOpen: true,
          permissions: {change_settings: true}
        })}
      />
    )
    const node = tree.find('Spinner')
    ok(node.exists())
  })
})
