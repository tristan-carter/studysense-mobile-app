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
    var isBreak: Bool = false
    func getTimeIntervalSinceNow() -> Double {
      guard let finishesAt = self.finishesAt else {
        return 0
      }
      let timeRemaining = finishesAt.timeIntervalSince1970 - Date().timeIntervalSince1970
      if finishesAt > Date() {  // Check if 'finishesAt' is in the future
          return timeRemaining  // Positive if in the future
      } else {
          return -1   // Negative if in the past
      }
    }
  }
}

struct StudyCountdownWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: StudyCountdownWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
          HStack(alignment: .center) { // Ensure centered vertical alignment
              Image("StudySenseLogo")
                  .resizable()
                  .scaledToFit()
                  .frame(width: 70, height: 70)
                  .padding(13)

              VStack(alignment: .leading) { // Align timer & text to the left
                  if context.state.getTimeIntervalSinceNow() > 0 {
                      Text(Date(timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()), style: .timer)
                          .font(.largeTitle)
                          .fontWeight(.semibold)
                          .monospacedDigit()

                      Spacer()

                      if context.state.isBreak {
                          Text("Brain break in progress...")
                          .font(.callout)                      } else {
                          Text("Stay focused.")
                          .font(.callout)
                      }
                  } else {
                      Text("Finished")
                          .font(.title)
                          .fontWeight(.medium)
                  }
              }
              .padding(.trailing)
              .padding(.vertical, 18)
              
              Spacer()
          }
          .activityBackgroundTint(Color.white.opacity(0.5))

        } dynamicIsland: { context in
          DynamicIsland {
            DynamicIslandExpandedRegion(.leading) {
              Image("StudySenseLogo")
                .resizable()
                .frame(width: 50, height: 50)
            }
            DynamicIslandExpandedRegion(.center) {
              if context.state.getTimeIntervalSinceNow() > 0 {
                Text(Date(timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()), style: .timer)
                    .font(.title)
                    .fontWeight(.medium)
                    .monospacedDigit()
                    .foregroundColor(Color("PrimaryColor"))
                    .padding(10)
              }
            }
          } compactLeading: {
            Image("StudySenseLogo")
              .resizable()
              .frame(width: 35, height: 35, alignment: .trailing)
              .padding(5)
          } compactTrailing: {
            Text(Date(timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()), style: .timer)
              .monospacedDigit()
              .foregroundColor(Color("PrimaryColor"))
              .font(.title)
              .fontWeight(.medium)
              .frame(maxWidth: .minimum(50, 50), alignment: .leading)
          } minimal: {
            Image("StudySenseLogo")
          }
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
    StudyCountdownWidgetAttributes.ContentState(finishesAt: Date(), isBreak: false)
  }
}

#Preview("Notification", as: .content, using: StudyCountdownWidgetAttributes.preview) {
   StudyCountdownWidgetLiveActivity()
} contentStates: {
    StudyCountdownWidgetAttributes.ContentState.initState
}
