import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const TYPES = {
  lost: {
    label: 'Perdido',
    accent: colors.orange,
    soft: '#FBE8DF',
    icon: '!',
  },

  adoption: {
    label: 'En adopción',
    accent: colors.primary,
    soft: '#F1F0D7',
    icon: '♥',
  },

  emergency: {
    label: 'Emergencia',
    accent: colors.blueDark,
    soft: '#E5ECF5',
    icon: '+',
  },
}

function AlertCard({
  type = 'lost',
  petName,
  photo,
  location,
  date,
  description,
  contact,
}) {
  const variant =
    TYPES[type] ||
    TYPES.lost

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.accent,
          {
            backgroundColor:
              variant.accent,
          },
        ]}
      />

      <View style={styles.top}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor:
                variant.soft,
            },
          ]}
        >
          <Text
            style={[
              styles.iconText,
              {
                color:
                  variant.accent,
              },
            ]}
          >
            {variant.icon}
          </Text>
        </View>

        <View style={styles.heading}>
          <Text
            style={[
              styles.type,
              {
                color:
                  variant.accent,
              },
            ]}
          >
            {variant.label}
          </Text>

          <Text style={styles.name}>
            {petName}
          </Text>
        </View>

        {!!photo && (
          <View
            style={
              styles.photoWrapper
            }
          >
            <Image
              source={photo}
              contentFit="cover"
              style={styles.photo}
            />
          </View>
        )}
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          📍 {location}
        </Text>

        <Text style={styles.metaText}>
          {date}
        </Text>
      </View>

      <Text style={styles.description}>
        {description}
      </Text>

      {!!contact && (
        <View
          style={[
            styles.contact,
            {
              backgroundColor:
                variant.soft,
            },
          ]}
        >
          <Text
            style={[
              styles.contactText,
              {
                color:
                  variant.accent,
              },
            ]}
          >
            Contacto: {contact}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',

    width: '100%',

    padding: 18,
    paddingLeft: 22,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#E8E1D6',

    borderRadius: 26,

    backgroundColor:
      colors.surface,

    ...shadows.soft,
  },

  accent: {
    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    width: 7,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },

  icon: {
    width: 44,
    height: 44,

    flexShrink: 0,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 14,
  },

  iconText: {
    fontFamily:
      fonts.displayExtraBold,

    fontSize: 21,
  },

  heading: {
    flex: 1,
  },

  type: {
    marginBottom: 1,

    fontFamily:
      fonts.bodyBold,
    fontSize: 10.5,

    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  name: {
    color: colors.textDark,

    fontFamily:
      fonts.displayBold,
    fontSize: 19,

    lineHeight: 23,
  },

  photoWrapper: {
    width: 58,
    height: 58,

    overflow: 'hidden',

    borderRadius: radius.pill,

    backgroundColor:
      colors.accent,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  meta: {
    marginTop: 14,

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',

    gap: 6,
  },

  metaText: {
    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 11,
  },

  description: {
    marginTop: 11,

    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 13,

    lineHeight: 19,
  },

  contact: {
    marginTop: 13,

    paddingHorizontal: 13,
    paddingVertical: 9,

    borderRadius: 16,
  },

  contactText: {
    fontFamily:
      fonts.bodySemiBold,
    fontSize: 11.5,
  },
})

export default AlertCard