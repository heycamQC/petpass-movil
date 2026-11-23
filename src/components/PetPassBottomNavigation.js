
import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, shadows } from '../theme'

// Iconos PNG integrados en el codigo: no requieren librerias ni archivos SVG.
// Solo usamos expo-image, que ya forma parte de PetPass.
const ICONS = {
  grid: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAgElEQVR42u2YSQqAMBAEHf+Vu+D/b+pB/Uf5AHdxxapz6KFIYEJnmYjIKwFKoGc7DZCeyp0a1LGf6u7cWBjEkZuLiFgRODU3//pTV0ABBRRQQIE5mgN53YYzV+WOVn4C6h3/lRYonsoVERGxlbCVsJVQQAEFFFBAAVsJWwkR+RMDkCGmCQ1b79UAAAAASUVORK5CYII=' },
  home: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABoElEQVR42u2XTStEURyHf38rIYoFIZJiyWJospCvwBRSWNlbYaMsbX0GOyWSrOQDiMRGrJBQJMpbxGMzwmXMi7kvU+fZ3bs5z3PP+dc9ksPhcKQCqAFqClW+DTgCToFYockngDs+eQSGCkHcgEnglZ+8AbNAUVTli4F50rMAlERNvhbYJHN2gIaoyLcDJ2TPGdAZtnw/cE/uPAHDYQ7rG/8n2OEGSoFF8s8qUO63fB2whX/sAo1+yceBc/znEujOt/wg8EBwPAGj+RrWGcJjLufhBsqAJcJnDajIVr4e2CY67AFNmcp3ARdEjyugx+v72/mallQdwf/FKkmT3pf2yw5UStqU1ByxgGNJHWZ2+ecOmNm1pD5J9x9NkqZCEB5Pri1Jj5ISXvl0s9ALvABjyedASa45AjwDA6k8LU1Ei5kdfgQE+fnNzJLrtprZQU4BnphQAtIRzftpFriAFMTMg6SY2wEX4AJcgAtwAS7gHwEPAXrd+RGwEWDAuh8BE5JuA5C/yeYGmHGAme1Likta+XLdzPexWZYU/+sC43A4vvMO7KImeuTo2wwAAAAASUVORK5CYII=' },
  map: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABv0lEQVR42u3Zr08cURTF8d0Vm1SQAAYMgmBxFQjqqFxTUUllZS11ldj2HyBBUlxrKpCkqmnQ6N2gCYaEgU/N2wToMD/e7JY0uScZM3vvmffNvje7ObfXC4VC2cIqjlCk6xhrM/Rfwz7GmGA0K+NNHODa37rBV2x38N9OHjePvMddF/4K33GnmX7jPV408B7iLX5WGeYseoh3OJOvC3zCSon/SvrsoolRm4Uv4WPae7PSNQ7xMl2HT2zDfAAs4wuuarxO8abk/g6+4bYD6G3y2MkBOKkwLtLh2rpXX/oAbOAzLlss/DL1bNT5VwEUJcZX6VtZL6mvfAAW8AHnFQs/TzULbf17dQ3Yw2LT+oq6AUYl/iMMcv37ZQ0PCvr9fh3wc9YP/vd/AwEQAAEQAAEQAAEQAAEQAAEQAAEQAAHQUtOYpOR+ZUzSwn8RezmNzxpUYb0i2iyyAeYdFWIrxZZFhd9Ja4B5h7UpID6t6Z9Gm8s5AHONy2s0SRH/UvYZmPfA4gmdpaHKsPMhfqRf2G1inCY7u6mnie7wA6+7vr7G/3BoN92GB9icyQ9Deo9PEsj+HMamx/fGskdY7YVCoWz9ATmJMdAzSLmYAAAAAElFTkSuQmCC' },
  settings: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC0UlEQVR42u2ZS0hUURjH/8fUER0XhiIV7XpQWARhRVDuo7UuWtSmTXuDXGVU2qpaBekmUZKgFuUiiEBcCdpjEUERFKi4KASjyMrx1+YIg8ycuefMnbk3mD/M6rvne5/vcUaqoYZ0AbhOcdyMW15dBWw47aD1pN37GeCXIwJ/gdY0R+CYpCYHvV7SSYcDmoGGihkAXAVeAieKfHIqApszBfg2ApckfZI06WuEj/L5eAoctrQuYKxE+uTjHXAOqAfOA5+30B/HakQB5TeRA6aBdcKw4qDFY4RD+WpgCsj8r8pv4lE5l/hICqrzVxfRlIjAbknvJWUTUn5F0n5jzLegCBhjFiQNJuj9AZfyJSNgo1AvaS6BdHojqdsYkyurkRlj1iXNJuD92VLKR61Eu4A1j6qxAPQDB4AG+zsIXAYWPfisATsrPR5vxRjQ4uCVBcY9+F0LVbod6AVGgNWIwh4AUe6UASYi8lwFRoE+oCOK4kPAvB0R8EybFg8HZYElTxk54BUw7GK8Edgt+wOifCVQ1kYl9oGpKp1x9wFrnQngkzHG/PHd3iSthVxRY0xdJXfiIOclvVLuCTizL00GnK3SmZJ5OWxLlW8ZXQSyHnJagWXf6gO8BW5FEdBhm8eoRyMb92hkkx61/yFwAdhRjVFiwhUJ6/lJD37P4hrmfnsIXbJNqss+dGWAQ8BAQNr0xHU37iWwC8/EUoWAOklHE+gTx4G9cZTRi5K6EzCgUdJQWd0QaJP0UVJ7gh27xxgzExqBGwkrL0l3bBoHGZC08ptoDq0+22wjSQpzwPZyS2iDfWgthGXgLvAzQLkfwG3gSxH6dGx/hhQwYsPuy22W3gkMRhw7Vu23nfZsk2183/O+eQ40x5qEeUZ8KNYh7exUCiNFznYC94EnZb1IRzCiyUHvi2BAr9IK+xyTKzFddijNAF47DJiPW14lduIXgbQaakgC/wCWDhzGgvsNuAAAAABJRU5ErkJggg==' },
  account: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABlklEQVR42u2Yzy5DQRSHz7htPIAlG6F2bJq08aclyhMI3oPnsLHDzorGExDVsvJnXfbSlbQb2kRCP5uR2IjbO9POYL5kNndzf9+ZzD1zrkggEAj8KYBV4AB4AF70ugf2gRWfg08BNX6mCmR8C18EWsSnBRR8qnwv4T9pApM+CFRITs2HA2tKySTDkKHDpoU6bLgUWLAgUHQpMGpBYMylgA26LgUaFgQaLgWuLAhcuhQ4tiBQdt0Lzg16QNWHTjwOPP3aq4SWKOhAvYT34zL3RSIDXMQIX/Gm8t+IlIA9oA4861XXz5Ztv09ZCj0sIjkRWRSRvO6uI3qJiDT1ehSRaxGpicitUurVdbVn9PjYTnCI23rMnHY1xJxhj9OBjJlABGwDHezTAbaAoX6GP6T/HAEp2+HTwAmDowykbQrsMnh2bIVfwg3dON1axRC4E5Gsoy/1jVIqn/g6rSuQddhqcsCsyTyw5sHtZN1EYN4DgTkTgQkPBDKJDzHwJiKRY4F3pVQq6Q5EHuxA5Pt/ISOCQCAQCPxvPgBwADu2NzW/RwAAAABJRU5ErkJggg==' },
  pets: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADCUlEQVR42u2Zy0tUURzHv2d8ZGZUpvZgTKOnmNHKyIKSkiBXPTYRBVnt2rWoP6AWLgoisGjVIrCg2rSxJwUhEtUiikKCSEsUetrTR37aXCmOc++548y9EswXZjFzvr/H9577O79zzkg55JBDDsA8YOH/mPh84C5/8RCoddiUAmeBPqAXaAWmTUXy+cAjJuIDsNTHZjbwPIXNpakQsBt/3PSxuRBg0xi3gHaCUWvxK4HfAfxzk8kjkYGG5Y7xrdb3Zke8urgFGMe4XQe1Dn5x3AJ6HOP51vcSB38gbgH30hTY7+B3ZrtIFwCHgP1AVYrxcuBrQFHWW/xtAdwRYEmKGMXAWmBFusk3A9//CTAMnAASFu+wT0K3UvjMA1748E9Z3ARwzHpAt4HSMMnPBj6FCeTxjwK/rG5c4eN7DfDe8nkZKLR4533iXwsjoCVgqseADT6v23ZgE5Dn8F8BHAGOA1tSjO9yxK9yCTjpaFDXI26QTx3xd2S6Cm2JavMFrAzR0IqC1mpJ6g7hoFLSq4BEEpLKJM31fvoo6YMxZtThe3XG/QdYBIw6ptFvt9kIXAUGU9j8AG4AOwHjY7/PEfdLqNkHLgY4+QYUWPw5wBXC4x6QTBF3vcOuNey7WAG89nHSZnGrgZekj3dAXYozxhsffjcwM52Cqga6LCedwCxL6GSSH8cAsMyK2wT8tHjPgOq0d5Teu7pR0kpJvZI6jDG/vbECbz/UkOHi80xSvTHm5z9xayQdkDRDUpekdmPMcLaXvNNkD2fiPo01eF0xWxgD1sUp4CHZR1dcyTcRHTbHcaA5GOHzacn2uXbCXZCkz97qEAW+SpozvtJFMQOrIkxekmZKqonyFVoUQ5kloxRgYhBgohTwNgYBPVEWcYF3PVIaUfL9kpKRFbExZkTS+Qiffls6yU+2kZUEXI9kgsdAUVzdOAk8yWLy94GyuDd0hcBe78wwat2ydXj/H5R7nz3AHet6fQh44PnIi2XJchR3pVdTvcaYIR/edEmLJQ1K6jPGjCmHHHLI4b/GH9GLQ3UzXfZ2AAAAAElFTkSuQmCC' },
  alerts: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABwElEQVR42u2YvWsVQRRHzxXyorx8aERUCIhIlDyFYBohpYK2ok3AdCIKkv9FLEWwtHyViJBGsFVEEYmVhYiCmFgo0UCOha+N+jY7s6vMKXeX5XfmztydHSgUCv80UefL1GlgCTgHnAIODm59AF4CK8D9iHjXqlFQD6n31E3/zKZ6Vz3QlvAX1E8Oz0f1bNPhL6s/rM539WJT4c+oG+6cb+p87vCj6qr18UodqZJlV0WH68DxGsekB1zN0kbVAFaBmZoL+zoiejkqMJcgPMCsejKHwELC5bWQQ+BYQoGZHAJjCQUmcnWh1lAEikARKAJFILvAaMI8IzkEUm4ljibdTqv7gfdAJ5HABnA4ItZTVWA5YXiA3cDNJBVQZ4GnwJ7E6/IrMB8Rb2qrgDoF9DOEB+gCfXVfLQLqBPAQOJGxO/aAB+r4Tk8fxtQnNsdjtVs1fEddsXkeqZ0qU2iZX4e0TXMeuFFFoEt76A7dRgcfrTvAkYbDvwWuRcQahUKLUW8P0RpvtfGH5sUQzz5vYwX2qut/Mfqf1cm2TqMldes34bfUxbavhSvq2jYjX3v4SCQxCVwCTg8uPQP6EfGltLv/jZ9GyE+DVOzSwAAAAABJRU5ErkJggg==' },
  logout: { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACAUlEQVR42u2ZPUskQRCGn1JZNBRBOA7kIv0DIoiCmV6wq4jsTzjQ32BsZuqfUPxYNfAuluM+zI3lEkEDQ0+U12SEYenR3Zme7hnYgg2GKWbfp6eqq2oaBjawQmYfOUiaAqaB8R6f+Q/4bWaKSiZpSdIv5bOOJIspflPSi4rZfAitQ66VB/Zc92phBcImSgiZI2FvunzugG3gofJJLGnFsZrfqhwx3XHecPjcVhlgJODbNWA2ubzyFWJDAcUfAH+SX0fSaG0AkpXfSF23gGMfEDH3+q8+IEIBXAGnZUAEAUgStg2cZ0B0JI1VOoTM7CnJAxfEMnCSByJoDpQBETyJfUNE2YV8QuSuxKnK+qUAyz4wB0w6II4krZvZo3eAVGXdKLlOHEhafa/tyBtCsyWLf7Nmqn+qXCUuZ6Tso7IeBtB3nvyX3xwwM0lqe0jiUWDXkcQAF0C7r7ZbUssxkbVKarEbks4yZurvvfZHUXJAUiMJwabj9g9g7aPtMxqAT/HBAXyLDwpQhvgYM3EzY7fJJT70TLyaIX49r/jYlbiw+NAzcbpyn/kQX6idLlC5weOHrWBf5hLBf8tu5v47fD5VuRvtfgPXDp8dScPAfY/PjHtGJulnnQ44XACLkp49QMQ5IzOzS2ALeKn1qCZpQdJlrc7IMkA+AzPARC2SeGAD689eAVnWodxLPnHMAAAAAElFTkSuQmCC' },
}

// Icono reutilizable para ambas navegaciones.
export function PetPassIcon({ name, color, size = 28, style }) {
  return (
    <Image
      source={ICONS[name]}
      contentFit="contain"
      tintColor={color}
      style={[{ width: size, height: size }, style]}
    />
  )
}

const ITEMS = [
  { id: 'qr', icon: 'grid', route: 'Mascotas', label: 'Mascotas' },
  { id: 'home', icon: 'home', route: 'Home', label: 'Inicio' },
  { id: 'map', icon: 'map', route: 'Mapa', label: 'Mapa' },
  { id: 'settings', icon: 'settings', route: 'Cuenta', label: 'Cuenta' },
]

function PetPassBottomNavigation({ navigation, activeSection = 'home' }) {
  const handlePress = (item) => navigation.navigate(item.route)

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.navigation}>
        {ITEMS.map((item) => {
          const active = activeSection === item.id

          return (
            <Pressable
              key={item.id}
              onPress={() => handlePress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
            >
              <PetPassIcon
                name={item.icon}
                color={colors.orange}
                size={29}
                style={[styles.icon, active && styles.iconActive]}
              />
            </Pressable>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    width: '100%',
    backgroundColor: colors.yellowNav,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    ...shadows.soft,
  },
  navigation: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPressed: {
    transform: [{ scale: 0.92 }],
  },
  icon: {
    opacity: 0.72,
  },
  iconActive: {
    opacity: 1,
    transform: [{ scale: 1.12 }],
  },
})

export default PetPassBottomNavigation
