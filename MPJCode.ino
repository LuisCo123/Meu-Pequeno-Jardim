#include <SPI.h>
#include <SD.h>
#include <ArduinoJson.h>
#include <WiFi.h>  // Estabelecer a conexão da ESP32 à rede Wi-Fi.
#include <string.h>
#include <ESP32Servo.h>
#include <WiFiManager.h>
#include <ArduinoMqttClient.h>

// Define Struct
struct Bay {
  int idBay;

  int pinBomb;
  int pinLight;
  int domeID;
  int pinUmySensor;

  bool statusBomb;
  bool statusLight;
  bool statusDome;

  float umySensorValue;
  float umySensorValueDefault;
  float lightTimePicker;
  float lightTimePickerDefault;
};

// Define PINS
const int pinoReleBomba1 = 16;  // Exemplo: pino GPIO 5
const int pinoReleBomba2 = 17;  // Exemplo: pino GPIO 18
const int pinDome1 = 4;         // Exemplo: pino GPIO 13
//const int pinoServoDireito2 = 14;   // Exemplo: pino GPIO 14
const int pinDome2 = 0;  // Exemplo: pino GPIO 12
//const int pinoServoEsquerdo2 = 27;  // Exemplo: pino GPIO 27
const int umidadeSensorBaia1 = 34;  // Exemplo: pino GPIO 34
const int umidadeSensorBaia2 = 35;  // Exemplo: pino GPIO 35
const int nivelSensor = 32;         // Exemplo: pino GPIO 32
const int ledBaia1 = 33;            // Exemplo: pino GPIO 19
const int ledBaia2 = 25;            // Exemplo: pino GPIO 21

// Define variables
Bay baia[2];
const int chipSelect = 5;
Servo servosBay[2];
const char broker[] = "test.mosquitto.org";
int port = 1883;
String topic;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// Cria um buffer de memória para o JSON. O tamanho é ajustado ao tamanho do JSON.
StaticJsonDocument<3072> doc;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Hello, ESP32!");
  Serial.println("Inicializando o SD card...");

  // Verifica se o cartão SD foi inicializado corretamente
  if (!SD.begin(chipSelect)) {
    Serial.println("Falha na inicialização do SD card!");
    configBay("");
  } else {
    Serial.println("SD card inicializado com sucesso!");
    String data = readFile("baysConfig");
    configBay(data);
  }
  connectWifi();
  attachPins();
}

void loop() {
  // put your main code here, to run repeatedly:
  for (int i = 0; i < 2; i++) {
    controlHumidity(&baia[i]);
    controlLight(&baia[i]);
  }
  // String docSerializedJson = serializeJsonStruct();
  // Serial.println(docSerializedJson);
  writeFile("baysConfig");
  mqttClient.poll();
  recieveMessage();
  sendMessage();
  delay(5000);
}

void configBay(String configs) {
  if (configs == "") {
    baia[0] = { 0, 16, 33, 0, 34, false, false, false, 55, 55, 485, 500 };
    baia[1] = { 1, 17, 255, 1, 35, false, false, false, 55.2, 60.0, 490, 500 };
    writeFile("baysConfig");
  } else {
    if (convertJson(configs)) {
      for (JsonObject module : doc["bays"].as<JsonArray>()) {
        int idBay = module["idBay"];

        baia[idBay].idBay = idBay;
        baia[idBay].pinBomb = module["pinBomb"];
        baia[idBay].pinLight = module["pinLight"];
        baia[idBay].domeID = module["domeID"];
        baia[idBay].pinUmySensor = module["pinUmySensor"];

        baia[idBay].statusBomb = module["statusBomb"];
        baia[idBay].statusLight = module["statusLight"];
        baia[idBay].statusDome = module["statusDome"];

        baia[idBay].umySensorValue = module["umySensorValue"];
        baia[idBay].umySensorValueDefault = module["umySensorValueDefault"];
        baia[idBay].lightTimePicker = module["lightTimePicker"];
        baia[idBay].lightTimePickerDefault = module["lightTimePickerDefault"];
      }
    } else {
      configBay("");
    }
  }
}

void updateBay(String configs) {
  StaticJsonDocument<3072> docRecived;
  DeserializationError error = deserializeJson(docRecived, configs);
  // Verifica se houve erro na deserialização
  if (error) {
    Serial.print("Erro na leitura do JSON: ");
    Serial.println(error.f_str());
  } else {
     for (JsonObject module : docRecived.as<JsonArray>()) {
        int idBay = module["idBay"];
        baia[idBay].umySensorValue = module["umySensorValue"];
        baia[idBay].umySensorValueDefault = module["umySensorValueDefault"];
        baia[idBay].lightTimePicker = module["lightTimePicker"];
        baia[idBay].lightTimePickerDefault = module["lightTimePickerDefault"];
      }
      Serial.println(serializeJsonStruct());
  }
}
void writeFile(String nameArchive) {
  // Abre o arquivo para leitura:
  File dataFile = SD.open("/" + nameArchive + ".json", FILE_WRITE);

  // Verifica se o arquivo foi aberto corretamente
  if (dataFile) {
    Serial.println("Escrevendo no arquivo...");
    String docSerializedJson = serializeJsonStruct();
    dataFile.println(docSerializedJson);
    // Fecha o arquivo após a escrita
    dataFile.close();
    Serial.println("Arquivo escrito e fechado com sucesso.");
  } else {
    // Se houver erro ao abrir o arquivo, exibe uma mensagem de erro
    Serial.println("Erro ao abrir o arquivo para escrita.");
  }
}

String readFile(String nameArchive) {
  File dataFileRead = SD.open("/" + nameArchive + ".json");
  String allfile = "";
  if (dataFileRead) {
    Serial.println("Lendo arquivo:");

    // Lê o arquivo linha por linha e imprime no terminal:
    while (dataFileRead.available()) {
      char c = dataFileRead.read();  // Lê um caractere
      allfile += c;                  // Adiciona o caractere à string
    }

    // Fecha o arquivo após a leitura:
    dataFileRead.close();
  } else {
    // Se o arquivo não puder ser aberto, exibe uma mensagem de erro:
    Serial.println("Erro ao abrir o arquivo");
  }
  return allfile;
}

boolean convertJson(String jsonString) {
  Serial.println("Convertendo arquivo");


  // Deserializa a string JSON e armazena os dados no documento
  DeserializationError error = deserializeJson(doc, jsonString);

  // Verifica se houve erro na deserialização
  if (error) {
    Serial.print("Erro na leitura do JSON: ");
    Serial.println(error.f_str());
    return false;
  }
  return true;
}

String serializeJsonStruct() {
  // Criar um objeto JSON
  DynamicJsonDocument docWriter(1024);  // Tamanho do documento JSON
  // Preencher o documento JSON com o array de estruturas
  JsonArray jsonArray = docWriter.createNestedArray("bays");

  for (int i = 0; i < 2; i++) {
    JsonObject baiaObject = jsonArray.createNestedObject();
    baiaObject["idBay"] = baia[i].idBay;
    baiaObject["pinBomb"] = baia[i].pinBomb;
    baiaObject["pinLight"] = baia[i].pinLight;
    baiaObject["domeID"] = baia[i].domeID;
    baiaObject["pinUmySensor"] = baia[i].pinUmySensor;
    baiaObject["statusBomb"] = baia[i].statusBomb;
    baiaObject["statusLight"] = baia[i].statusLight;
    baiaObject["statusDome"] = baia[i].statusDome;
    baiaObject["umySensorValue"] = baia[i].umySensorValue;
    baiaObject["umySensorValueDefault"] = baia[i].umySensorValueDefault;
    baiaObject["lightTimePicker"] = baia[i].lightTimePicker;
    baiaObject["lightTimePickerDefault"] = baia[i].lightTimePickerDefault;
  }
  String strginJson;
  serializeJson(jsonArray, strginJson);
  return strginJson;
}

String serializeJsonStructToMqtt() {
  // Criar um objeto JSON
  DynamicJsonDocument docWriter(1024);  // Tamanho do documento JSON
  // Preencher o documento JSON com o array de estruturas
  JsonArray jsonArray = docWriter.createNestedArray("bays");

  for (int i = 0; i < 2; i++) {
    JsonObject baiaObject = jsonArray.createNestedObject();
    baiaObject["idBay"] = baia[i].idBay;
    baiaObject["umySensorValue"] = baia[i].umySensorValue;
    baiaObject["umySensorValueDefault"] = baia[i].umySensorValueDefault;
    baiaObject["lightTimePicker"] = baia[i].lightTimePicker;
    baiaObject["lightTimePickerDefault"] = baia[i].lightTimePickerDefault;
  }
  String strginJson;
  serializeJson(jsonArray, strginJson);
  return strginJson;
}

void connectWifi() {
  WiFiManager wifiManager;
  wifiManager.setConfigPortalTimeout(240);
  if (!wifiManager.autoConnect("MeuPequenoJardim")) {
    Serial.println(F("Falha na conexao. Resetar e tentar novamente..."));
    delay(3000);
    ESP.restart();
    delay(5000);
  }
  Serial.println(F("Conectado na rede Wifi."));
  Serial.print(F("Endereco IP: "));
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.SSID());
  connectMqtt();
}

void connectMqtt() {
  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());
    while (1)
      ;
  }
  String topicMqtt = WiFi.SSID() + "-" + WiFi.localIP().toString();
  Serial.println("You're connected to the MQTT broker!");
  Serial.println(topicMqtt);
  mqttClient.subscribe(topicMqtt);
  topic = topicMqtt;
  Serial.println();
}

void recieveMessage() {
  // Se receber uma nova mensagem no tópico assinado
  if (mqttClient.available()) {
    String topic = mqttClient.messageTopic();
    String payload = mqttClient.readString();
    Serial.print("Mensagem recebida no tópico: ");
    Serial.println(topic);
    Serial.print("Conteúdo: ");
    Serial.println(payload);
    updateBay(payload);
  }
}

void sendMessage() {
    String docSerializedJson = serializeJsonStructToMqtt();
    mqttClient.beginMessage(topic+"-ESP");
    mqttClient.print(docSerializedJson);
    mqttClient.endMessage();
}
void attachPins() {
  pinMode(pinoReleBomba1, OUTPUT);
  pinMode(pinoReleBomba2, OUTPUT);
  pinMode(umidadeSensorBaia1, INPUT);
  pinMode(umidadeSensorBaia2, INPUT);
  pinMode(nivelSensor, INPUT);
  pinMode(ledBaia1, OUTPUT);
  pinMode(ledBaia2, OUTPUT);
  servosBay[0].attach(pinDome1);
  servosBay[1].attach(pinDome2);
}

void openBay(Bay* baiaParameter) {
  Serial.print("Abrindo baia de: ");
  Serial.println(baiaParameter->idBay);
  servosBay[baiaParameter->domeID].write(45);
  baiaParameter->statusDome = true;
  ledsOn(baiaParameter);
}

void closeBay(Bay* baiaParameter) {
  Serial.print("Fechando baia de: ");
  Serial.println(baiaParameter->idBay);
  servosBay[baiaParameter->domeID].write(0);
  baiaParameter->statusDome = false;
  ledsOff(baiaParameter);
}

void ledsOn(Bay* baiaParameter) {
  Serial.print("Ligando luzes de: ");
  Serial.println(baiaParameter->idBay);
  digitalWrite(baiaParameter->pinLight, HIGH);
  baiaParameter->statusLight = true;
}

void ledsOff(Bay* baiaParameter) {
  Serial.print("Desligando luzes de: ");
  Serial.println(baiaParameter->idBay);
  digitalWrite(baiaParameter->pinLight, LOW);
  baiaParameter->statusLight = false;
}

void bombOn(Bay* baiaParameter) {
  Serial.print("Ligando bomba de: ");
  Serial.println(baiaParameter->idBay);
  digitalWrite(baiaParameter->pinBomb, HIGH);
}

void bombOff(Bay* baiaParameter) {
  Serial.print("Desligando bomba de: ");
  Serial.println(baiaParameter->idBay);
  digitalWrite(baiaParameter->pinBomb, LOW);
}

void updateHumidity(Bay* baiaParameter) {
  Serial.print("Verificando Umidade de: ");
  Serial.println(baiaParameter->idBay);
  baiaParameter->umySensorValue = analogRead(baiaParameter->pinUmySensor);
}

void controlHumidity(Bay* baiaParameter) {
  Serial.print("Controlando Umidade de: ");
  Serial.println(baiaParameter->idBay);
  updateHumidity(baiaParameter);
  if (baiaParameter->umySensorValueDefault >= baiaParameter->umySensorValue && !baiaParameter->statusBomb) {
    bombOn(baiaParameter);
  } else if (baiaParameter->umySensorValueDefault < baiaParameter->umySensorValue && baiaParameter->statusBomb) {
    bombOff(baiaParameter);
  }
}

void controlLight(Bay* baiaParameter) {
  Serial.print("Controlando Luz de: ");
  Serial.println(baiaParameter->idBay);
  if (baiaParameter->lightTimePickerDefault > baiaParameter->lightTimePicker && !baiaParameter->statusDome) {
    openBay(baiaParameter);
    if (!baiaParameter->statusLight) {
      ledsOn(baiaParameter);
    }
  } else if (baiaParameter->lightTimePickerDefault <= baiaParameter->lightTimePicker && baiaParameter->statusLight) {
    ledsOff(baiaParameter);
    if (baiaParameter->statusDome) {
      closeBay(baiaParameter);
    }
  }

  if (baiaParameter->statusLight) {
    Serial.print("Somando 5 segundos na luz de: ");
    Serial.println(baiaParameter->idBay);
    baiaParameter->lightTimePicker += 5, 5;
  }
}
