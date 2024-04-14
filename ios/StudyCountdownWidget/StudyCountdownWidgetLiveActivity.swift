//
//  StudyCountdownWidgetLiveActivity.swift
//  StudyCountdownWidget
//
//  Created by Tristan Carter on 14/04/2024.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct StudyCountdownWidgetAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var finishesAt: Date?
    func getTimeIntervalSinceNow() -> Double {
      guard let finishesAt = self.finishesAt else {
        return 0
      }
      let timeRemaining = finishesAt.timeIntervalSince1970 - Date().timeIntervalSince1970
      return timeRemaining > 0 ? timeRemaining : -1 // Check if countdown is over
    }
  }
}

struct StudyCountdownWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: StudyCountdownWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            HStack {
              Image("AppIcon")
                  .resizable()
                  .scaledToFit()
                  .frame(width: 30, height: 30)
              if context.state.getTimeIntervalSinceNow() > 0 {
                  Text(Date(timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()),
                       style: .timer)
                      .font(.title)
                      .fontWeight(.medium)
                      .monospacedDigit()
                      .padding()
              } else {
                  Text("Finished")
                      .font(.title)
                      .fontWeight(.medium)
                      .padding()
              }
            }
            .activityBackgroundTint(Color.white.opacity(0.5))

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("DI L")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("DI T")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("DI B")
                    // more content
                }
            } compactLeading: {
                Text("CL")
            } compactTrailing: {
                Text("CT")
            } minimal: {
                Text("Min")
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension StudyCountdownWidgetAttributes {
    fileprivate static var preview: StudyCountdownWidgetAttributes {
        StudyCountdownWidgetAttributes()
    }
}

extension StudyCountdownWidgetAttributes.ContentState {
  fileprivate static var initState: StudyCountdownWidgetAttributes.ContentState {
    StudyCountdownWidgetAttributes.ContentState(finishesAt: Date())
  }
}

#Preview("Notification", as: .content, using: StudyCountdownWidgetAttributes.preview) {
   StudyCountdownWidgetLiveActivity()
} contentStates: {
    StudyCountdownWidgetAttributes.ContentState.initState
}
