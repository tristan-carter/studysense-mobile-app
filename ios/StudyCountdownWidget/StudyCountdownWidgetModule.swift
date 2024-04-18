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
  private var isBreak: Bool = false
  var isFinished: Bool = false

  private func areActivitiesEnabled() -> Bool {
    return ActivityAuthorizationInfo().areActivitiesEnabled
  }

  @objc
  func startLiveActivity(_ timestamp: Double, isBreak: Bool) -> Void {
    finishesAt = Date(timeIntervalSince1970: timestamp)
    if (!areActivitiesEnabled()) {
      // User disabled Live Activities for the app, nothing to do
      return
    }
    // Preparing data for the Live Activity
    let activityAttributes = StudyCountdownWidgetAttributes()
    let contentState = StudyCountdownWidgetAttributes.ContentState(finishesAt: finishesAt, isBreak: isBreak)
    let activityContent = ActivityContent(state: contentState,  staleDate: nil)
    do {
        try Activity.request(attributes: activityAttributes, content: activityContent)
    } catch let error {
        print("ActivityKit Error: \(error)")
        // Add specific actions based on the error (e.g., retry, log events, alert the user)
    }
  }

  @objc
  func stopLiveActivity() -> Void {
    // A task is a unit of work that can run concurrently in a lightweight thread, managed by the Swift runtime
    // It helps to avoid blocking the main thread
    finishesAt = nil
    isBreak = false
    isFinished = false
    Task {
      for activity in Activity<StudyCountdownWidgetAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
    }
  }
}
