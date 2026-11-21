import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import {
  colors,
  spacing,
} from '../theme'

function ScreenContainer({
  children,
  scroll = true,
  contentStyle,
  backgroundColor = colors.background,
}) {
  if (!scroll) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          {
            backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.content,
            contentStyle,
          ]}
        >
          {children}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  content: {
    flexGrow: 1,

    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
})

export default ScreenContainer