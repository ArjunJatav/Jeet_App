#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>  // Import the module

@interface AppDelegate () <UNUserNotificationCenterDelegate>  // Conform to the protocol
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"fantasyapp";
  [FIRApp configure];
  

  // Set up push notification permissions
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;  // Now this is valid since AppDelegate conforms to the protocol
  
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionBadge | UNAuthorizationOptionAlert)
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      NSLog(@"User authorization granted!");
    } else {
      NSLog(@"User authorization denied.");
    }
  }];
  
  // Register for remote notifications
  [application registerForRemoteNotifications];
  
 
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Handle receiving remote notifications
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
     fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  // Use RNCPushNotificationIOS directly
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Handle device token for push notifications
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [FIRMessaging messaging].APNSToken = deviceToken;
}

// Handle failure to register for remote notifications
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"Failed to register for notifications: %@", error);
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end