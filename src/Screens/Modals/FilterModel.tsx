import React, {useState} from 'react';
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {Entypo} from '../../Components/ReactIcons/ReactIcon';
import {commonModalStyle} from './styles';
import {colors} from '../../Components/Colors';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export const FilterModal = (props: any) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Function to calculate date range
  const getDateRange = (weeksAgo: number) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7 * weeksAgo); // Move back by the given weeks
    return {
      label: `Last ${weeksAgo === 1 ? 'Week' : `${weeksAgo} Weeks`}`,
      from: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
      to: today.toISOString().split('T')[0], // Current date
    };
  };

  const getMonthRange = (monthsAgo: number) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - monthsAgo); // Move back by given months
    return {
      label: `Last ${monthsAgo === 1 ? 'Month' : `${monthsAgo} Months`}`,
      from: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
      to: today.toISOString().split('T')[0], // Current date
    };
  };

  // Define time filters with actual date ranges
  const timeFilters = [
    getDateRange(1),
    getDateRange(2),
    getMonthRange(1),
    getMonthRange(3),
  ];

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      transparent={true}
      onRequestClose={props.onRequestClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={[
            commonModalStyle.modal_view,
            {height: windowHeight * 0.6, top: 0, width: windowWidth - 20},
          ]}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 20,
              paddingHorizontal: 10,
              marginTop: 10,
              color: colors.black,
              fontWeight: '500',
            }}>
            Filter
          </Text>

          {/* Close Button */}
          <TouchableOpacity
            style={commonModalStyle.cancel_button}
            onPress={props.cancel}>
            <Entypo name="cross" size={24} color={colors.scarletRed} />
          </TouchableOpacity>

          {/* Transaction Type Filter */}
          <Text
            style={{
              marginTop: 20,
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "600",
            }}>
            Transaction Type
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              paddingHorizontal: 10,
            }}>
            {['Credit', 'Debit'].map(type => (
              <TouchableOpacity
                key={type}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginHorizontal: 5,
                  backgroundColor:
                    selectedType === type ? colors.scarletRed : colors.white,
                  borderColor: selectedType === type ?  colors.scarletRed :colors.titleColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setSelectedType(type)}>
                <Text
                  style={{
                    color: selectedType === type ? colors.white : colors.black,
                  }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time Period Filter */}
          <Text
            style={{
              marginTop: 20,
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "600",
            }}>
            Time Period
          </Text>
          <FlatList
            // horizontal
            data={timeFilters}
            keyExtractor={item => item.label}
            contentContainerStyle={{paddingHorizontal: 10, marginTop: 10}}
            renderItem={({item}: any) => (
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginRight: 10,

                  backgroundColor:
                    //@ts-ignore
                    //@ts-ignore
                    selectedTime?.label === item.label
                      ? colors.scarletRed
                      : 'white',  //@ts-ignore
                  borderColor:   selectedTime?.label === item.label ?  colors.scarletRed :colors.titleColor,

                }}
                onPress={() => setSelectedTime(item)}>
                <Text
                  style={{
                    color:
                      //@ts-ignore
                      //@ts-ignore
                      selectedTime?.label === item.label
                        ? 'white'
                        : colors.black,
                  }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Apply & Reset Buttons */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              marginHorizontal: 10,
              marginBottom: 10,
            }}>
           

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: colors.spotScarletRed,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
               
                marginRight: 5,
              }}
              onPress={() => {
                setSelectedType(null);
                setSelectedTime(null);
              }}>
              <Text style={{color:colors.scarletRed}}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: colors.scarletRed,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
             
              }}
              onPress={() => {
                props.applyFilters({
                  type: selectedType ?? '',
                  time: selectedTime ?? '',
                }),
                  setSelectedType(null);
                setSelectedTime(null);
              }}>
              <Text style={{color: 'white'}}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
