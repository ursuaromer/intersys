// import React from 'react';
// import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
// import tw from 'twrnc';
// import { useColorScheme } from 'react-native';

// // Define TypeScript interface for component props (if needed)
// interface AboutProps {}

// // Modern About component for Intersys app
// const About: React.FC<AboutProps> = () => {
//   // Use color scheme for dark/light mode support
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';

//   // Function to handle external link
//   const openLink = (url: string) => {
//     Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
//   };

//   return (
//     <ScrollView
//       style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
//       contentContainerStyle={tw`p-6`}
//     >
//       {/* Header Section */}
//       <View style={tw`items-center mb-8`}>
//         <Image
//           source={require('@/assets/images/intersys.png')} // Replace with your app's logo
//           style={tw`w-32 h-32 mb-4`}
//           resizeMode="contain"
//         />
//         <Text style={tw`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           About Intersys
//         </Text>
//         <Text style={tw`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-center`}>
//           Your gateway to the cosmos
//         </Text>
//       </View>

//       {/* App Description */}
//       <View style={tw`mb-8`}>
//         <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//           Our Mission
//         </Text>
//         <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           Intersys is a React Native application designed to inspire and educate users about the wonders of space. 
//           Explore detailed information about planets, engage in an exciting space-themed game, and dive into the mysteries of the universe.
//           Our goal is to make learning about space accessible, fun, and interactive for everyone.
//         </Text>
//       </View>

//       {/* Features Section */}
//       <View style={tw`mb-8`}>
//         <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//           What We Offer
//         </Text>
//         <View style={tw`ml-4`}>
//           <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//             • Interactive planet information with stunning visuals
//           </Text>
//           <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//             • Engaging space-themed game to test your cosmic knowledge
//           </Text>
//           <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//             • Regular updates with the latest space discoveries
//           </Text>
//         </View>
//       </View>

//       {/* Team Section */}
//       <View style={tw`mb-8`}>
//         <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//           Our Team
//         </Text>
//         <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           Intersys was created by a passionate team of developers, designers, and space enthusiasts dedicated to bringing the universe closer to you. 
//           We are committed to continuously improving the app and adding new features to enhance your experience.
//         </Text>
//       </View>

//       {/* Contact Section */}
//       <View style={tw`mb-8`}>
//         <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//           Get in Touch
//         </Text>
//         <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
//           Have questions or suggestions? We'd love to hear from you!
//         </Text>
//         <TouchableOpacity
//           style={tw`bg-blue-500 p-3 rounded-lg items-center`}
//           onPress={() => openLink('mailto:support@intersys.app')}
//         >
//           <Text style={tw`text-white font-semibold`}>Contact Us</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Footer */}
//       <View style={tw`items-center mt-8`}>
//         <Text style={tw`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//           Intersys v1.0.0 | © 2025 Intersys Team
//         </Text>
//         <TouchableOpacity onPress={() => openLink('https://intersys.app')}>
//           <Text style={tw`text-sm text-blue-500 mt-2`}>Visit our website</Text>
//         </TouchableOpacity>
//      -{}-</View>
//     </ScrollView>
//   );
// };

// export default About;

import React from 'react';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import tw from 'twrnc';

// Define TypeScript interface for component props (optional)
interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  return (
    <>
      {/* ✅ Personaliza el encabezado de la vista */}
      <Stack.Screen options={{ title: "Acerca de la Aplicacion", headerShown: true }} />

      {/* ✅ Contenido scrollable con diseño adaptado */}
      <ScrollView
        style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        contentContainerStyle={tw`p-6`}
      >
        {/* Header Section */}
        <View style={tw`items-center mb-8`}>
          <Image
            source={require('@/assets/images/intersys.png')}
            style={tw`w-32 h-32 mb-4`}
            resizeMode="contain"
          />
          <Text style={tw`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            About Intersys
          </Text>
          <Text style={tw`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-center`}>
            Your gateway to the cosmos
          </Text>
        </View>

        {/* App Description */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Our Mission
          </Text>
          <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Intersys es una aplicación diseñada para inspirar y educar sobre el espacio. Explora planetas, juega, y aprende.
          </Text>
        </View>

        {/* Features Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            What We Offer
          </Text>
          <View style={tw`ml-4`}>
            <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              • Información interactiva con visuales
            </Text>
            <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              • Juegos espaciales divertidos
            </Text>
            <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              • Actualizaciones frecuentes
            </Text>
          </View>
        </View>

        {/* Team Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Our Team
          </Text>
          <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Un equipo apasionado de desarrolladores y entusiastas del espacio.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Get in Touch
          </Text>
          <Text style={tw`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            ¿Tienes preguntas o sugerencias? ¡Contáctanos!
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-lg items-center`}
            onPress={() => openLink('mailto:support@intersys.app')}
          >
            <Text style={tw`text-white font-semibold`}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={tw`items-center mt-8`}>
          <Text style={tw`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Intersys v1.0.0 | © 2025 Intersys Team
          </Text>
          <TouchableOpacity onPress={() => openLink('https://intersys.app')}>
            <Text style={tw`text-sm text-blue-500 mt-2`}>Visit our website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default About;
