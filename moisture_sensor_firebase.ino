#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <FirebaseArduino.h>
#include <WiFiUdp.h>
#include <ESP8266HTTPClient.h>
#include <NTPClient.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define OLED_RESET 4
#include "OakOLED.h"
OakOLED oled;
 
// Set these to run example.
#define FIREBASE_HOST "moisture-sensor-be5c5.firebaseio.com"
#define FIREBASE_AUTH "h0CVmmpPIbvmX2sqWTMJGFIW4kshuUF8X0iagP6u"
#define WIFI_SSID "Galaxy"
#define WIFI_PASSWORD "gbfd2135"

String date;
String currTime;
// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
 
String myString;
int vr = A0; // moisture sensor data connected 
             //it is the analog voltage corresponding to the resistance of the soil  
int sdata = 0; // The variable resistor value will be stored in sdata.

 
void setup()
{
  // Debug console
  Serial.begin(9600);
  pinMode(vr ,INPUT);
  // connect to wifi.
  pinMode(D0,OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED)
      {
    Serial.print(".");
    delay(500);
      }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  timeClient.begin();
  timeClient.setTimeOffset(19800);
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday;
  int currentMonth = ptm->tm_mon+1;
  int currentYear = ptm->tm_year+1900;
  date = String(currentYear) + "/" + String(currentMonth) + "/" + String(monthDay);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  oled.begin();

}
 
void loop()
{
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday;
  String Day = String(monthDay);
  if(Day.length() <= 1){
    Day = "0"+Day;
  }
  int currentMonth = ptm->tm_mon+1;
  String Month = String(currentMonth);
  if(Month.length() <=1){
    Month = "0"+Month;
  }
  int currentYear = ptm->tm_year+1900;
  date = String(currentYear) + "-" + Month + "-" + Day;
  sdata = analogRead(vr);
  myString = String(sdata);
  Serial.println(date); 
  Serial.println(myString); 
  Firebase.setString(date, myString);
  data();
  delay(1000);            
}

void data(){
    oled.clearDisplay();
    oled.setTextSize(1);
    oled.setTextColor(1);
    oled.setCursor(0, 0);
    oled.println("Moisture");
    oled.setTextSize(2);
    oled.setCursor(10, 12);
    oled.println(String(sdata));
    oled.setTextSize(2);
    oled.setCursor(80, 12);
    oled.println("ohm");
    
    
    oled.setTextSize(1);
    oled.setTextColor(1);
    oled.setCursor(3, 29);
    oled.println("Date : ");
    oled.setTextSize(2);
    oled.setTextColor(1);
    oled.setCursor(10,40 );
    oled.println(date);
    oled.display();
  }
