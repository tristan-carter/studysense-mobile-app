//
//  StudyCountdownWidgetModule.swift
//  StudySenseMobile
//
//  Created by Tristan Carter on 14/04/2024.
//

import Foundation
import ActivityKit

@objc(StudyCountdownWidgetModule)
class StudyCountdownWidgetModule: NSObject {
  private var finishesAt: Date?

  private func areActivitiesEnabled() -> Bool {
    return ActivityAuthorizationInfo().areActivitiesEnabled
  }

  @objc
  func startLiveActivity(_ timestamp: Double) -> Void {
    finishesAt = Date(timeIntervalSince1970: timestamp)
    if (!areActivitiesEnabled()) {
      // User disabled Live Activities for the app, nothing to do
      return
    }
    // Preparing data for the Live Activity
    let activityAttributes = StudyCountdownWidgetAttributes()
    let contentState = StudyCountdownWidgetAttributes.ContentState(finishesAt: finishesAt)
    let activityContent = ActivityContent(state: contentState,  staleDate: nil)
    do {
      // Request to start a new Live Activity with the content defined above
      try Activity.request(attributes: activityAttributes, content: activityContent)
    } catch {
      // Handle errors, skipped for simplicity
    }
  }

  @objc
  func stopLiveActivity() -> Void {
    // A task is a unit of work that can run concurrently in a lightweight thread, managed by the Swift runtime
    // It helps to avoid blocking the main thread
    finishesAt = nil
    Task {
      for activity in Activity<StudyCountdownWidgetAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
    }
  }
}
