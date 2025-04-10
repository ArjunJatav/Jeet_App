// types.ts (or wherever you store your types)
export type HomeParamList = {
    HomeScreen: undefined; // No params for HomeScreen
    ContestDetails:  { params: any }; // Define the params for TeamPreviewScreen
    CreateTeamScreen:  { params: any, fromButton :String }; // Define the params for TeamPreviewScreen
    SelectCaptainScreen:  { params: any }; // Define the params for TeamPreviewScreen
    TeamPreviewScreen: { params: any, }; // Define the params for TeamPreviewScreen
    TermsandConditonScreen: undefined; // Define the params for TeamPreviewScreen
    NotificationScreen: undefined; // Define the params for TeamPreviewScreen
    WalletWithdrawScreen: undefined; // Define the params for TeamPreviewScreen
  };