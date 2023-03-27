import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Pagination extends Component {
  render() {
    const { currentPage, totalPages, onPrevPage, onNextPage } = this.props;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity onPress={onPrevPage} disabled={currentPage <= 1}>
          <Text style={styles.paginationText}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.paginationNumber}>{currentPage} / {totalPages}</Text>
        <TouchableOpacity onPress={onNextPage} disabled={currentPage === totalPages}>
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30
  },
  paginationNumber: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  paginationText: {
    fontSize: 20, 
    marginHorizontal: 10
  }
})
