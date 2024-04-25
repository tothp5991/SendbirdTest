import { useConnection } from '@sendbird/uikit-react-native'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as ExpoClipboard from 'expo-clipboard';
import * as ExpoDocumentPicker from 'expo-document-picker';
import * as ExpoFS from 'expo-file-system';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ExpoMediaLibrary from 'expo-media-library';
import * as ExpoNotifications from 'expo-notifications';
import * as ExpoAV from 'expo-av';
import * as ExpoVideoThumbnail from 'expo-video-thumbnails';
import * as ExpoImageManipulator from 'expo-image-manipulator';
import { createExpoClipboardService, createExpoFileService, createExpoMediaService, createExpoNotificationService, createExpoPlayerService, createExpoRecorderService } from "@sendbird/uikit-react-native";

const expoPlatformServices = {
  clipboard: createExpoClipboardService(ExpoClipboard),
  notification: createExpoNotificationService(ExpoNotifications),
  file: createExpoFileService({
    fsModule: ExpoFS,
    imagePickerModule: ExpoImagePicker,
    mediaLibraryModule: ExpoMediaLibrary,
    documentPickerModule: ExpoDocumentPicker,
  }),
  media: createExpoMediaService({
    avModule: ExpoAV,
    thumbnailModule: ExpoVideoThumbnail,
    imageManipulator: ExpoImageManipulator,
    fsModule: ExpoFS,
  }),
  player: createExpoPlayerService({
    avModule: ExpoAV,
  }),
  recorder: createExpoRecorderService({
    avModule: ExpoAV,
  }),
};

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useSendbirdChat,
  createGroupChannelListFragment,
  createGroupChannelCreateFragment,
  createGroupChannelFragment,
} from '@sendbird/uikit-react-native';
import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { LogLevel } from '@sendbird/chat';

const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelCreateFragment = createGroupChannelCreateFragment();
const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelListScreen = () => {
  const navigation = useNavigation();
  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        // Navigate to GroupChannelCreate function.
        navigation.navigate('GroupChannelCreate', { channelType });
      }}
      onPressChannel={(channel) => {
        // Navigate to GroupChannel function.
        navigation.navigate('GroupChannel', { channelUrl: channel.url });
      }}
    />
  );
};

const GroupChannelCreateScreen = () => {
  const navigation = useNavigation()

  return (
    <GroupChannelCreateFragment
      onCreateChannel={async (channel) => {
        // Navigate to GroupChannel function.
        navigation.replace('GroupChannel', { channelUrl: channel.url });
      }}
      onPressHeaderLeft={() => {
        // Go back to the previous screen.
        navigation.goBack();
      }}
    />
  );
};

const GroupChannelScreen = () => {
  const navigation = useNavigation()
  const { params } = useRoute()

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelFragment
      channel={channel}
      onChannelDeleted={() => {
        // Navigate to GroupChannelList function.
        navigation.navigate('GroupChannelList');
      }}
      onPressHeaderLeft={() => {
        // Go back to the previous screen.
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to GroupChannelSettings function.
        navigation.navigate('GroupChannelSettings', { channelUrl: params.channelUrl });
      }}
    />
  );
};

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const RootStack = createNativeStackNavigator();
const Navigation = () => {
  const { currentUser } = useSendbirdChat();
  const { connect } = useConnection()

  useEffect(() => {
    (async () => {
      try {
        await connect('5bcbf08622e2ad6f015a2dae99fd43bf1b83658e', { nickname: 'test2_sendbird', accessToken: '0671581021e3790be62885b024b22095d98a52f4' })
      } catch (error) {
        return error
      }
    })()
  }, [])

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={'GroupChannelList'} component={GroupChannelListScreen} />
        <RootStack.Screen name={'GroupChannelCreate'} component={GroupChannelCreateScreen} />
        <RootStack.Screen name={'GroupChannel'} component={GroupChannelScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App () {
  return (
    <SendbirdUIKitContainer
      appId={'C485BAC1-EE81-4CE0-8A83-386AD3B7C719'}
      chatOptions={{ 
        localCacheStorage: AsyncStorage,
        logLevel: LogLevel.DEBUG
      }}
      platformServices={expoPlatformServices}
    >
      {/* Rest of your app */}
      <Navigation />

    </SendbirdUIKitContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
