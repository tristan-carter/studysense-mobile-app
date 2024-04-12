import React from 'react';
import { View, Text, Dimensions } from 'react-native';

import { PieChart } from "react-native-gifted-charts";

import colours from '../../../../config/colours';

const countLevels = (data) => {
    const levelCounts = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
    };
    data.forEach((item) => {
        levelCounts[item.levelLearned]++;
    });
    return levelCounts;
};

const renderDot = color => {
    return (
        <View
        style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: color,
            marginRight: 8,
        }}
        />
    );
};

const renderLegendComponent = (pieData) => {
    return (
      <View style={{
        flexDirection: 'column',
        display: 'flex',
        alignSelf: 'center',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/*<Text style={{color: colours.black, fontFamily: 'Lato', marginBottom: 10}}>
          Study progress
    </Text>*/}
        <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            alignSelf: 'center',
        }}>
            <View
              style={{
              flexDirection: 'column',
              }}>
                <View
                  style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                  }}>
                    {renderDot(colours.learned)}
                    <Text style={{color: colours.black, fontFamily: 'Lato'}}>Learned {pieData[3].value}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row', 
                    alignItems: 'center', 
                  }}>
                    {renderDot(colours.learning)}
                    <Text style={{color: colours.black, fontFamily: 'Lato'}}>Learning {pieData[1].value}</Text>
                </View>
            </View>
            <View 
              style={{
                flexDirection: 'column', 
              }}>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>
                  {renderDot(colours.partiallyLearned)}
                  <Text style={{color: colours.black, fontFamily: 'Lato'}}>Partially learned {pieData[2].value}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row', 
                    alignItems: 'center', 
                  }}>
                  {renderDot(colours.notLearned)}
                  <Text style={{color: colours.black, fontFamily: 'Lato'}}>Not learned {pieData[0].value}</Text>
                </View>
            </View>
          </View>
      </View>
    );
};

const donutChartComponent = (cards) => {
    const screenHeight = Dimensions.get('window').height;

    const levelCounts = countLevels(cards);

    const pieData = [
        { name: "not learned", value: levelCounts[0], color: colours.notLearned },
        { name: "learning", value: levelCounts[1], color: colours.learning },
        { name: "partially learned", value: levelCounts[2], color: colours.partiallyLearned },
        { name: "learned", value: levelCounts[3], color: colours.learned },
    ];
    let maxNonZeroValue = 0;
    let maxNonZeroValueIndex = -1;
    
    for (let i = 0; i < pieData.length; i++) {
      if (pieData[i].value !== 0 && pieData[i].value > maxNonZeroValue) {
        maxNonZeroValue = pieData[i].value;
        maxNonZeroValueIndex = i;
      }
    }

    let totalValue = 0;

    for (let i = 0; i < pieData.length; i++) {
      totalValue += pieData[i].value;

      if (pieData[i].value !== 0 && pieData[i].value > maxNonZeroValue) {
        maxNonZeroValue = pieData[i].value;
        maxNonZeroValueIndex = i;
      }
    }
    
    const donutCenterName = maxNonZeroValueIndex !== -1 ? pieData[maxNonZeroValueIndex].name : null;
    const donutCenterValue = maxNonZeroValueIndex !== -1 ? ((pieData[maxNonZeroValueIndex].value / totalValue) * 100).toFixed(0) : null;
    return (
        <View
          style={{
            width: '100%',
          }}>
          { screenHeight <= 800 ? (<></>) : (
            <View style={{marginTop: 0, marginBottom: 3, alignItems: 'center'}}>
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                radius={108}
                innerRadius={77}
                innerCircleColor={colours.backgroundColour}
                centerLabelComponent={() => {
                  return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text
                        style={{fontFamily: 'Lato', fontSize: 21, color: colours.black,  fontWeight: '400'}}>
                        {donutCenterValue === null ? "No Cards" : donutCenterValue + "%"}
                      </Text>
                      <Text style={{fontFamily: 'Lato', fontSize: 14, color: colours.black, fontWeight: '400'}}>{donutCenterName}</Text>
                    </View>
                  );
                }}
              />
            </View>
          )}
          {renderLegendComponent(pieData)}
        </View>
    );
};

export default donutChartComponent;