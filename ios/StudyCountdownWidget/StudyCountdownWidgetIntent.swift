//
//  StudyCountdownWidgetIntent.swift
//  StudyCountdownWidgetExtension
//
//  Created by Tristan Carter on 18/04/2024.
//

import Foundation
import AppIntents

public struct FinishIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Finish study countdown"
  public func perform() async throws -> some IntentResult {
    return .result()
  }
}
