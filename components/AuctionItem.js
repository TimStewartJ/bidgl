import { bool, func, shape } from 'prop-types';
import React from 'react';
import {
  Text, View, Image, Linking, StyleSheet, Pressable, TouchableHighlight,
} from 'react-native';
import datesAreOnSameDay from '../Utility';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    width: '20%',
  },
  thumb: {
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hyperlinkStyle: {
    fontSize: 22,
    color: 'blue',
  },
  collapse: {
    position: 'absolute',
    width: '10%',
    right: 0,
    backgroundColor: 'red',
  },
  favorite: {
    position: 'absolute',
    width: '10%',
    left: 0,
    backgroundColor: 'green',
  },
});

export default function AuctionItem({
  item, showImage, updateCollapsed, updateFavorites,
}) {
  const url = item.item_url || item.url;
  const dateTime = new Date((parseInt(item.end_time, 10) - item.time_offset) * 1000);
  const currentDate = new Date();
  const sameDay = datesAreOnSameDay(currentDate, dateTime);

  return (
    <View style={styles.card}>
      <Image style={styles.thumb} source={{ uri: showImage ? item.images[0].thumb_url : '' }} />

      <View>
        <TouchableHighlight
          onPress={() => {
            Linking.openURL(url);
          }}
        >
          <Text href={url} style={styles.hyperlinkStyle}>{item.title}</Text>
        </TouchableHighlight>
        <Text>
          Current Bid: $
          {item.current_bid}
        </Text>
        <Text style={{ color: sameDay ? 'red' : 'black' }}>
          {dateTime.toLocaleDateString()}
        </Text>
        <Text>
          {dateTime.toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.collapse}>
        <Pressable onPress={() => updateCollapsed(item.id, true)}>
          <Text accessibilityHint="collapse item">-</Text>
        </Pressable>
      </View>

      <View style={styles.favorite}>
        <Pressable onPress={() => updateFavorites(item.id, true)}>
          <Text accessibilityHint="Favorite Item">!</Text>
        </Pressable>
      </View>

    </View>
  );
}

AuctionItem.propTypes = {
  item: shape({}).isRequired,
  showImage: bool.isRequired,
  updateCollapsed: func.isRequired,
  updateFavorites: func.isRequired,
};
