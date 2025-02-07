import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native-web';
import { arrayOf, func, string } from 'prop-types';
import axios, { toFormData } from 'axios';
import AuctionItem from './AuctionItem';

const Favorites = memo(({ favorites, updateFavorites }) => {
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    axios.all(favorites.map((favorite) => axios.post('https://www.bidrl.com/api/ItemData', toFormData({
      item_id: favorite,
    })))).then((responses) => {
      setItemData(responses.map((res) => res.data));
    });
  }, [favorites]);

  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}
    >
      {itemData.map((favorite) => (
        <AuctionItem
          item={favorite}
          showImage
          updateCollapsed={(id) => updateFavorites(id, false)}
          updateFavorites={() => null}
          updateFavoriteskey={favorite.id}
          key={favorite.id}
        />
      ))}
    </View>
  );
});

export default Favorites;

Favorites.propTypes = {
  favorites: arrayOf(string.isRequired).isRequired,
  updateFavorites: func.isRequired,
};
