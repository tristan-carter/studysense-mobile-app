//
//  StudyCountdownWidgetBridge.m
//  StudySenseMobile
//
//  Created by Tristan Carter on 14/04/2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(StudyCountdownWidgetModule, NSObject)

+ (bool)requiresMainQueueSetup {
  return NO;
}

RCT_EXTERN_METHOD(startLiveActivity:(nonnull double *)timestamp isBreak:(BOOL)isBreak)
RCT_EXTERN_METHOD(stopLiveActivity)

@end
