import React, { useState } from 'react';
import { Text, View } from 'react-native';
import styles from './AppStyles';
import LocationSelection from './components/LocationSelection';
import NotificationProvider from './contexts/NotificationContext';
import Notification from './components/Notification';
import AuctionList from './components/AuctionList';

export default function App() {
  const [checkedAffiliates, updateCheckedAffiliates] = useState([]);

  return (
    <View style={styles.body}>
      <NotificationProvider>

        <Text style={{ fontSize: 64, fontWeight: 900 }}>
          BID
          <span style={{ color: 'GrayText' }}>GL</span>
        </Text>
        <Text>
          <span style={{ color: 'GrayText' }}>Good Luck</span>
          , losers!
        </Text>
        <View style={styles.containerStyle}>
          <LocationSelection
            checkedAffiliates={checkedAffiliates}
            updateCheckedAffiliates={updateCheckedAffiliates}
          />
          <View>
            {checkedAffiliates.map((affiliate) => (
              <View
                key={affiliate.id}
              >
                <Text
                  style={{ textAlign: 'center', fontSize: 24 }}
                >
                  {affiliate.name}
                </Text>
                <AuctionList location={affiliate} />
              </View>
            ))}
          </View>
        </View>

        <Notification />

      </NotificationProvider>
    </View>
  );
}
