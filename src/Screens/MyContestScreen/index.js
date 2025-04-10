import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MatchesScreen from "./MyContestScreen";
import NotificationScreen from "../ProfileScreen/Notification";
import WalletWithdrawScreen from "../ProfileScreen/WalletWithdraw";
import UpcommingContest from "./UpcomingContest";
import TeamPreviewScreen from "../HomeScreen/TeamPreviewScreen";
import LiveContestScreen from "./LiveContestScreen";
import CompleteContest from "./CompleteContest";


const MatchStack = createNativeStackNavigator();
export default function MatchesRoute() {
    return(
        <MatchStack.Navigator screenOptions={{ headerShown: false }}>
             <MatchStack.Screen name="MatchesScreen" component={MatchesScreen} />
             <MatchStack.Screen name="NotificationScreen" component={NotificationScreen} />
             <MatchStack.Screen name="WalletWithdrawScreen" component={WalletWithdrawScreen} />
             <MatchStack.Screen name="UpcommingContest" component={UpcommingContest} />
             <MatchStack.Screen name="TeamPreviewScreen" component={TeamPreviewScreen} />
             <MatchStack.Screen name="LiveContestScreen" component={LiveContestScreen} />
             <MatchStack.Screen name="CompleteContest" component={CompleteContest} />
        </MatchStack.Navigator>
    )
}