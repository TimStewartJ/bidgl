import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { bool, shape, string } from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auction from './Auction';
import StorageKeys from '../StorageKeys';
import Favorites from './Favorites';
import { useNotification } from '../contexts/NotificationContext';
import datesAreOnSameDay from '../Utility';

export default function AuctionList({ location, endingToday }) {
  const [auctions, setAuctions] = useState({});
  const [auctionCollapsed, setAuctionCollapsed] = useState({});
  const [favorites, setFavorites] = useState([]);

  const { addMessage } = useNotification();

  useEffect(() => {
    axios.get(`https://www.bidrl.com/api/landingPage/${location.url}`).then(async (res) => {
      console.log(res.data);

      const auctionIds = Object.values(res.data.auctions).map((auction) => auction.id);

      // remove old auctions from collapsed state
      const collapsed = JSON.parse(await AsyncStorage.getItem(StorageKeys.auctionCollapsedKey) ?? '{}');
      if (collapsed != null && collapsed[location.id] !== undefined) {
        collapsed[location.id] = collapsed[location.id].filter((id) => auctionIds.includes(id));
        await AsyncStorage.setItem(StorageKeys.auctionCollapsedKey, JSON.stringify(collapsed));
      }

      setAuctionCollapsed(collapsed);

      setAuctions(res.data.auctions);

      const fetchedFavorites = JSON.parse(await AsyncStorage.getItem(StorageKeys.favoritesKey));
      setFavorites(fetchedFavorites == null ? [] : fetchedFavorites[location.id]);
    });
  }, []);

  const updateCollapsed = useCallback(async (id, add) => {
    let collapsed = JSON.parse(await AsyncStorage.getItem(StorageKeys.auctionCollapsedKey));
    // initialize collapsed object
    if (collapsed == null) {
      collapsed = {};
    }
    // initialize collapsed object for location
    if (collapsed[location.id] === undefined) {
      collapsed[location.id] = [];
    }
    collapsed[location.id] = collapsed[location.id].filter((i) => i !== id);
    if (add) {
      collapsed[location.id].push(id);
    }
    await AsyncStorage.setItem(StorageKeys.auctionCollapsedKey, JSON.stringify(collapsed));
    setAuctionCollapsed(collapsed);
  }, [auctionCollapsed]);

  const updateFavorites = useCallback(async (id, add) => {
    console.log(`Adding ${id} to favorites...`);

    addMessage(`Adding ${id} to favorites...`);

    let favoriteList = JSON.parse(await AsyncStorage.getItem(StorageKeys.favoritesKey));
    // initialize blacklist object
    if (favoriteList == null) {
      favoriteList = {};
    }
    // initialize blacklist object for location
    if (favoriteList[location.id] === undefined) {
      favoriteList[location.id] = [];
    }
    favoriteList[location.id] = favoriteList[location.id].filter((i) => i !== id);
    if (add) {
      favoriteList[location.id].push(id);
    }
    await AsyncStorage.setItem(StorageKeys.favoritesKey, JSON.stringify(favoriteList));
    setFavorites(favoriteList[location.id]);
  }, [favorites]);

  const callUpdateFavorites = useCallback((id, add) => updateFavorites(id, add), []);

  const auctionList = Object.values(auctions);
  let auctionsToShow = auctionList;

  auctionsToShow = !endingToday
    ? auctionsToShow
    : auctionsToShow.filter((auction) => datesAreOnSameDay(new Date(), new Date(auction.ends)));

  return (
    <View>
      <Favorites
        favorites={favorites == null ? [] : favorites}
        updateFavorites={callUpdateFavorites}
      />
      {auctionsToShow.map((auction) => (
        <Auction
          auction={auction}
          location={location}
          updateCollapsed={updateCollapsed}
          updateFavorites={callUpdateFavorites}
          key={auction.id}
          isCollapsed={auctionCollapsed[location.id]?.includes(auction.id)}
        />
      ))}
    </View>
  );
}

AuctionList.propTypes = {
  location: shape({ url: string }).isRequired,
  endingToday: bool.isRequired,
};
