import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {termsandConditon} from './ApiProvider';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {colors} from '../../Components/Colors';

let windowWidth = Dimensions.get('window').width;

export default function TermsandConditonScreen() {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);

  const [termsData, setTermsData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to strip HTML tags
  const stripHtmlTags = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ''); // Regular expression to remove HTML tags
  };

  // Fetch terms and conditions
  const termsandConditonMethos = useCallback(async () => {
    try {
      const response = await termsandConditon(authToken ?? '');
      if (response?.data?.content) {
        setTermsData(stripHtmlTags(response.data.content)); // Strip HTML tags
      } else {
        setTermsData('Terms and conditions not available');
      }
    } catch (error: any) {
      console.error('Error occurred:', error.message || 'An error occurred');
      setTermsData('An error occurred while fetching terms');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      termsandConditonMethos();
    }
  }, [authToken]);

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Terms & Conditions"
        onBackButton={() => navigation.goBack()}
      />

      <View style={accountStyle.accountContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.lightBlue} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {termsData ? (
              <Text style={styles.termsText}>{termsData}</Text>
            ) : (
              <Text style={styles.errorText}>
                No terms and conditions available
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    // padding: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: colors.orange,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
