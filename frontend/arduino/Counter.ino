const int tiltSensorPin = A0;  
int threshold = 10;            
int counter = 0;
bool positiveToNegative = false; 
bool negativeToPositive = false; 

void setup() {
  Serial.begin(9600);         
  pinMode(tiltSensorPin, INPUT);
}

void loop() {
  int tiltValue = analogRead(tiltSensorPin) - 512;

  if (tiltValue > threshold) {
    positiveToNegative = true; 
  } else if (tiltValue < -threshold && positiveToNegative) {
    positiveToNegative = false;
    counter++;
    Serial.println(counter);
  }

  if (tiltValue < -threshold) {
    negativeToPositive = true; 
  } else if (tiltValue > threshold && negativeToPositive) {
    negativeToPositive = false; 
    counter++;
    Serial.println(counter);
  }

  delay(100); 
}