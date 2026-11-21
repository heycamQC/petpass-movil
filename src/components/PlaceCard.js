import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  colors,
  fonts,
} from '../theme'

const CONFIG = {
  park: {
    icon: '🌳',
    label: 'Parque',
    color: colors.primary,
  },

  veterinary: {
    icon: '✚',
    label: 'Veterinaria',
    color: colors.blueDark,
  },

  petFriendly: {
    icon: '🐾',
    label: 'Pet Friendly',
    color: colors.orange,
  },
}

function PlaceCard({
  type = 'veterinary',
  name,
  address,
  schedule,
  description,
  embedded = false,
}) {
  const config =
    CONFIG[type] ||
    CONFIG.veterinary

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor:
            config.color,
        },
        embedded &&
          styles.embedded,
      ]}
    >
      {!embedded && (
        <View style={styles.type}>
          <Text style={styles.typeIcon}>
            {config.icon}
          </Text>

          <Text
            style={[
              styles.typeText,
              {
                color:
                  config.color,
              },
            ]}
          >
            {config.label}
          </Text>
        </View>
      )}

      {!embedded && (
        <Text style={styles.name}>
          {name}
        </Text>
      )}

      {!!address && (
        <Text
          style={[
            styles.address,
            embedded &&
              styles.embeddedText,
          ]}
        >
          {address}
        </Text>
      )}

      {!!schedule && (
        <Text
          style={[
            styles.schedule,
            embedded &&
              styles.embeddedText,
          ]}
        >
          <Text
            style={
              styles.scheduleBold
            }
          >
            Horario:{' '}
          </Text>

          {schedule}
        </Text>
      )}

      {!!description && (
        <Text
          style={[
            styles.description,
            embedded &&
              styles.embeddedDescription,
          ]}
        >
          {description}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',

    padding: 16,

    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 6,

    borderRadius: 28,

    backgroundColor: colors.white,
  },

  embedded: {
    padding: 0,

    borderWidth: 0,

    backgroundColor: 'transparent',
  },

  type: {
    marginBottom: 7,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
  },

  typeIcon: {
    fontSize: 15,
  },

  typeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,

    textTransform: 'uppercase',
  },

  name: {
    color: colors.text,

    fontFamily: fonts.displayBold,
    fontSize: 18,
  },

  address: {
    marginTop: 5,

    color: colors.text,

    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },

  schedule: {
    marginTop: 8,

    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 12,
  },

  scheduleBold: {
    fontFamily: fonts.bodySemiBold,
  },

  description: {
    marginTop: 8,

    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 12,

    lineHeight: 18,
  },

  embeddedText: {
    marginTop: 0,
    marginBottom: 6,

    color: colors.white,
  },

  embeddedDescription: {
    marginTop: 0,

    color:
      'rgba(255,255,255,0.90)',
  },
})

export default PlaceCard