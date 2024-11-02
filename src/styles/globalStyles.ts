import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

 export const globalStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
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