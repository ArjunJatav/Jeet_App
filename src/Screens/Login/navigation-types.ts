export type LoginStackParamList = {
    LoginScreen: undefined;
    ForgotPasswordScreen:{ email: string };
    EmailScreen:undefined;
    ProfileRoute:undefined;
    OtpVerification: { email: string,fromScreen : string };

  };