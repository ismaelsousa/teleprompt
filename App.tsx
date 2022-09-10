import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function App() {
  const scroll = useRef<ScrollView>();
  const currentPosition = useRef(0);
  const maxHeight = useRef(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [mirrored, setMirrored] = useState<Boolean>(true);
  const [speed, setSpeed] = useState<number>(5.5);
  const [script, setScript] = useState<string>("");
  const [editedScript, setEditedScript] = useState<string>("");

  const { height } = useWindowDimensions();

  useEffect(() => {
    if (!mirrored) {
      return;
    }
    const interval = setInterval(() => {
      if (currentPosition.current <= maxHeight.current) {
        currentPosition.current += speed;

        scroll.current?.scrollTo({
          y: currentPosition.current,
          animated: true,
        });
      } else {
        currentPosition.current = 0;
        scroll.current?.scrollTo({
          y: currentPosition.current,
        });
      }
    }, 40);

    return () => {
      currentPosition.current = 0;
      clearInterval(interval);
    };
  }, [mirrored]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.row}>
        <Button
          color={styles.button.backgroundColor}
          title={mirrored ? "Stop" : "Play"}
          onPress={() => setMirrored((old) => !old)}
        />
        <TouchableOpacity
          onPress={() => {
            setMirrored((old) => !old);
            setIsModalVisible((old) => !old);
          }}
        >
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scroll}
        style={styles.scrollView}
        onScrollEndDrag={(e) => {
          currentPosition.current = e.nativeEvent.contentOffset.y;
        }}
      >
        <View
          onLayout={(e) => {
            console.log(e.nativeEvent.layout.height);
            maxHeight.current = e.nativeEvent.layout.height;
          }}
        >
          {<View style={{ height: height / 2 }} />}

          <Text style={mirrored ? styles.textMirrored : styles.text}>
            {script}
          </Text>
          <View style={{ height: height / 2 }} />
        </View>
      </ScrollView>
      <Modal visible={isModalVisible}>
        <SafeAreaView style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.done}
              onPress={() => {
                setMirrored((old) => !old);
                setIsModalVisible((old) => !old);
                if (script !== editedScript) {
                  setScript(editedScript);
                }
              }}
            >
              <Text style={[styles.edit]}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.edit}>Speed:</Text>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  setSpeed((old) => old + 0.5);
                }}
              >
                <Text style={styles.edit}>+</Text>
              </TouchableOpacity>
              <Text>{speed}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSpeed((old) => old - 0.5);
                }}
              >
                <Text style={styles.edit}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            defaultValue={editedScript}
            value={editedScript}
            onChangeText={setEditedScript}
            style={styles.textInput}
            multiline
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  textMirrored: {
    transform: [{ rotateY: "180deg" }],
    fontSize: 50,
  },
  text: {
    fontSize: 50,
  },
  spaceVertical: {
    height: 500,
  },
  edit: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "black",
  },
  done: { alignItems: "flex-end", width: "100%" },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    minHeight: 200,
    fontSize: 20,
  },
});
