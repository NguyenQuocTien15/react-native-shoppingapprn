import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

 export const globalStyles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1, // Makes the TextInput take available width
    paddingVertical: 8,
  },
  iconContainer: {
    paddingLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  // searchInput: {
  //   flex: 1,
  //   height: 40,
  //   paddingHorizontal: 10,
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: colors.gray2,
  // },
   container: {
    flex : 1
   } ,
   center: {
    justifyContent: 'center',
    alignItems: 'center'
   },
   avatar: {
    width: 50,
    height: 50,
    borderRadius: 100
  }
})