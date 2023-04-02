import { Flex, Text } from "@chakra-ui/react";

const ColorPalettes = ({ palettes }) => {
  console.log(palettes)
  if (!palettes) return null;
  return (
    <Flex flexWrap="wrap" mt={6} flexDir="column">
      {palettes.map((palette, index) => (
        <Flex key={index} p={2}>
          <Flex>
            {palette.map((color, colorIndex) => (
            <Flex sx={{ flexDir: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Flex
                key={colorIndex}
                w={"75px"}
                h={"75px"}
                bg={color}
                // borderRadius="50%"
                // m={1}
              ></Flex>
              <Text fontSize={'xs'}>{color}</Text>
              </Flex>
              ))}
              
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default ColorPalettes;
