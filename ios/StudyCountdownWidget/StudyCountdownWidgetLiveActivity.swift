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
    var isFinished: Bool = false
    func getTimeIntervalSinceNow() -> Double {
      guard let finishesAt = self.finishesAt else {
        return 0
      }
      return self.finishesAt!.timeIntervalSince(Date())
    }
  }
}

struct StudyCountdownWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: StudyCountdownWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
          HStack(alignment: .center) {
              Image("StudySenseLogo")
                  .resizable()
                  .scaledToFit()
                  .frame(width: 70, height: 70)
                  .padding(13)

              VStack(alignment: .leading) {
                var timeLeft = context.state.getTimeIntervalSinceNow()

                if context.state.finishesAt!.timeIntervalSince(Date()) <= 0 {
                  if context.state.isBreak {
                      Text("Break finished")
                      .font(.callout)
                      .fontWeight(.semibold)               } else {
                      Text("Session finished, well done!")
                      .font(.callout)
                      .fontWeight(.semibold)
                  }
                  Text("Finished")
                      .font(.title)
                      .fontWeight(.medium)
                } else {
                      Text(Date(timeIntervalSinceNow: timeLeft), style: .timer)
                          .font(.largeTitle)
                          .fontWeight(.semibold)
                          .monospacedDigit()
                          .onAppear { // Add an onAppear modifier
                              Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                                  timeLeft = context.state.getTimeIntervalSinceNow() // Update timeLeft
                              }
                          }

                      Spacer()

                      if context.state.isBreak {
                          Text("Brain break in progress...")
                          .font(.callout)                      } else {
                          Text("Stay focused.")
                          .font(.callout)
                      }
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
