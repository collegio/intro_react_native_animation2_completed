import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager } from 'react-native';
import { Card, CardSection } from './common';
import { incrementIndex } from '../actions/selectedPlayer';

const SCREEN_W = Dimensions.get('window').width;

class PlayersList extends React.Component {

    constructor(props) {

        super(props);

        this.THRESHOLD = SCREEN_W * 0.3;
        this.position = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                this.position.setValue({x: gesture.dx, y: 0});
            },
            onPanResponderRelease: (e, gesture) => {
                
                if (gesture.dx > this.THRESHOLD) {  // swipe to the right
                    
                    // move the card off the screen
                    Animated.timing(this.position, {
                        toValue: { x: SCREEN_W*1.5, y: 0 },
                        duration: 250
                    }).start(() => this.onSwipeRight());

                } else if (gesture.dx < -this.THRESHOLD) {  // swipe to the left
                    
                    // move the card off the screen
                    Animated.timing(this.position, {
                        toValue: { x: -SCREEN_W*1.5, y: 0 },
                        duration: 250
                    }).start(() => this.onSwipeLeft());
                }
                else {
                    this.resetCard();
                }
            }
        });
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState(() => ({ index: 0 }));
        }
    }

    onSwipeRight() {
        alert("Let's get him to join the team!");

        this.updateCardIndex();            
    }

    onSwipeLeft() {
        alert("No thanks");

        this.updateCardIndex();

    }

    updateCardIndex() {
        this.setState((prevState) => {
            this.props.dispatch(incrementIndex());
        });

        this.position.setValue({ x: 0, y: 0 });
    }

    resetCard() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardAnimationStyle() {

        const SCREEN_W = Dimensions.get('window').width;    // Gets the screen width
        const GESTURE_WIDTH = SCREEN_W * 2;
        const rotate = this.position.x.interpolate({
            inputRange: [-GESTURE_WIDTH, 0, GESTURE_WIDTH],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    }

    renderCards() {
        if (this.props.curIndex >= this.props.data.length) {
            return (
                <Card>
                    <CardSection>
                        <Text>No more players available!</Text>
                    </CardSection>
                </Card>
            );
        }

        return this.props.data.map((item, index) => {

            if (index >= this.props.curIndex) {
                if (index === this.props.curIndex) {
                    return (
                        <Animated.View 
                            key={item.id}
                            style={[this.getCardAnimationStyle(), styles.cardStyle]}
                            {...this.panResponder.panHandlers}
                        >
                            {this.props.renderCard(item)}
                        </Animated.View>
                    );
                }

                return (
                    <Animated.View 
                        key={item.id}
                        style={[styles.cardStyle, { top: 20 * (index - this.props.curIndex) }]}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
        }).reverse();
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_W
    }
}

const mapStateToProps = (state) => {
    return {
        curIndex: state.selectedPlayer.curIndex
    }
};

export default connect(mapStateToProps)(PlayersList);