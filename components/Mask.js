import React from 'react';
import { Image, View } from 'react-native';

const Mask = ({
  face: {
    bounds: { origin: { x: faceX, y: faceY }, size: { width: faceWidth, height: faceHeight } },
    bounds,
    yawAngle,
    RIGHT_EAR,
    LEFT_EAR,
  }, selectedImage 
}) => {
  const capWidth = faceWidth*0.8;
  const capHeight = faceHeight*2.2;
  earWidth = faceWidth/5;
  //const translatedPosition = {
  //  x: LEFT_EAR.x - earWidth / 2 - faceX,//translatedEyePositionX(LEFT_EYE),
  //  y: LEFT_EAR.y - earWidth / 2 - faceY,//translatedEyePositionY(LEFT_EYE)
  //}
  // Calculate cap position and rotation based on face attributes
  const capPosition = {
    left: faceX,
    top: faceY - capHeight,
  };
  const TransformAngle = (
    angleRad = Math.atan(
      (RIGHT_EAR.y - LEFT_EAR.y) /
      (RIGHT_EAR.x - LEFT_EAR.x)
    )
  ) => angleRad * 180 / Math.PI
  //const capRotation = {
  //  transform: [{ rotateZ: `${yawAngle.toFixed(2)}deg` }],
  //};

  return (
      <View style={{
        position: 'absolute',
        left: faceX - capWidth *-0.1,
        top: faceY - capHeight * 0.5,
      }}>
        <Image
          source={selectedImage}
          style={{
            width: capWidth,
            height: capHeight,
            resizeMode: 'contain',
            transform: [{ rotate: `${TransformAngle()}deg`}]
          }}
        />
      </View>
    
  );
};

export default Mask;
