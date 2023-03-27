import React, { Component } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';
import Contact from './contact';
import PaginationDropdown from './paginationDropdown';
import Pagination from './pagination';

export default class SearchUsers extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      searchTerm: '',
      searchResults: [],
      error: '',
      currentUserId: 0,
      currentPage: 1,
      pageSize: 20,
      location: '',
      isLastPage: false,
    };

    this.onPrevPage = this.onPrevPage.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
  }

  handlePageSizeChange(pageSize) {
    this.setState({ pageSize });
  }

  async onPrevPage() {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      const { location } = this.state;
      const { searchTerm } = this.state;
      await this.search(searchTerm, location, currentPage - 1);
    }
  }

  async onNextPage() {
    const { isLastPage } = this.state;
    if (!isLastPage) {
      const { currentPage } = this.state;
      const { location } = this.state;
      const { searchTerm } = this.state;
      await this.search(searchTerm, location, currentPage + 1);
    }
  }

  async getContactPhoto(userId) {
    this.clearErrorMessages();
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}/photo`,
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) return response.blob();
        if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else throw 'Something went wrong while retrieving your data';
      })
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        return data;
      })
      .catch((thisError) => {
        this.setState({ error: thisError });
      });
  }

  async addContact(userIdToAdd) {
    this.clearErrorMessages();
    fetch(
      `http://localhost:3333/api/1.0.0/user/${userIdToAdd}/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          this.navigation.navigate('Contacts');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 404) throw 'User not found!';
        else if (response.status === 400) throw "You can't add yourself as a contact";
        else throw 'Something went wrong while retrieving your data';
      })
      .catch((thisError) => {
        this.setState({ error: thisError });
      });
  }

  async search(searchTerm, location, currentPage) {
    this.clearErrorMessages();
    const { pageSize } = this.state;
    this.setState({ location });
    this.setState({ isLastPage: false });
    this.state.currentUserId = await AsyncStorage.getItem('whatsthat_user_id');
    if (searchTerm === '') {
      this.setState({ searchTerm: '' });
      this.setState({ searchResults: [] });
      return;
    }
    this.setState({ searchTerm });
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}&limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`,
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          const responseJson = await response.json();
          // RESPONSEJSON HERE WAS ONLY HOLDING INFORMATION
          // ABOUT ID, NAME, LASTNAME, AND EMAIL OF THE CONTACT
          // I NEEDED TO ADD THE PHOTO IN RESPONSE SOMEHOW
          // WITH THE CALL BELOW, I AM MAKING MANY ASYNCRONOUS CALL OF
          // GETCONTACT PHOTO USING PROMISE AND THEN MAPPING IT TO ITEM.
          // IN THIS WAY, I AM ADDING THE PHOTO URL AS
          // NEW FIELD OF RESPONSEJSON AND IT IS ASSIGNED TO UPDATED RESPONSEJSON
          // I AM THEN SETTING MY SEARCH RESULTS STATUS

          const updatedResponseJson = await Promise.all(responseJson.map(async (item) => {
            const photo = await this.getContactPhoto(item.user_id);
            return { ...item, photo };
          }));
          this.setState({ searchResults: updatedResponseJson });
          this.setState({ currentPage });

          if (updatedResponseJson.length < pageSize) {
            this.setState({ isLastPage: true });
          }
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else throw 'Something went wrong while retrieving your data';
      })
      .catch((thisError) => {
        this.setState({ error: thisError.toString() });
      });
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  renderItem = ({ item }) => {
    const { currentUserId } = this.state;
    if (item.user_id !== currentUserId) {
      return (
        <View style={styles.contactViewContainer}>
          <Contact
            name={item.given_name}
            lastName={item.family_name}
            imageSource={item.photo}
            style={styles.contact}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => this.addContact(item.user_id)}>
            <Icon name="account-plus" color="green" size={40} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    const { searchTerm } = this.state;
    const { error } = this.state;
    const { searchResults } = this.state;
    const { currentPage } = this.state;

    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeader title="Search Users" />
        <View style={GlobalStyle.wrapper}>
          <TextInput
            style={styles.searchBarContainer}
            value={searchTerm}
            onChangeText={(currentSearchTerm) => this.setState({ searchTerm: currentSearchTerm })}
            placeholder="Search..."
          />
          <PaginationDropdown onValueChange={this.handlePageSizeChange} />
          <View style={styles.groupSearchButton}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                this.search(searchTerm, 'all', 1);
              }}
            >
              <Icon name="search-web" color="green" size={40} />
              <Text>Search All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                this.search(searchTerm, 'contacts', 1);
              }}
            >
              <Icon name="account-search" color="green" size={40} />
              <Text>Search Contacts</Text>
            </TouchableOpacity>
          </View>

          <>
            {
              error
              && (
              <View style={GlobalStyle.errorBox}>
                <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                <Text style={GlobalStyle.errorText}>{error}</Text>
              </View>
              )
            }
          </>

          <View style={[GlobalStyle.wrapper, styles.paddingFlatList]}>

            <FlatList
              data={searchResults}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <Pagination
              currentPage={currentPage}
              onPrevPage={this.onPrevPage}
              onNextPage={this.onNextPage}
            />
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    height: 40,
  },
  paddingFlatList: {
    paddingTop: 20,
  },
  addButton: {
    marginRight: 10,
    alignSelf: 'center',
  },
  contactViewContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 'thin',
    justifyContent: 'space-between',
  },
  contact: {
    width: '70%',
    borderBottomWidth: 0,
  },
  groupSearchButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchButton: {
    alignItems: 'center',
  },
  limitParameterGroup: {
    flexDirection: 'row',
  },
});
