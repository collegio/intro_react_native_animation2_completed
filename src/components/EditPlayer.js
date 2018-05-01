import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card, CardSection, Button, ConfirmModal } from './common';
import PlayerForm from './PlayerForm';
import { playerFormUpdate } from '../actions/playerForm';
import { updatePlayer, deletePlayer } from '../actions/players';

class EditPlayer extends React.Component {

    constructor(props) {
        super(props);
        
        this.onButtonPressed = this.onButtonPressed.bind(this);
        this.onDeleteButtonPressed = this.onDeleteButtonPressed.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onReject = this.onReject.bind(this);

        this.state = {
            modalVisible: false
        }
    }

    componentWillMount() {

        _.each(this.props.playerToEdit, (value, prop) => {
            this.props.dispatch(playerFormUpdate({ prop , value }))
        });

    }

    onButtonPressed() {
        const { name, gender, skill_level, sport_type, message, dispatch } = this.props;
        dispatch(updatePlayer({ name, gender, skill_level, sport_type, message, uid: this.props.playerToEdit.uid }));
    }

    onConfirm() {
        this.props.dispatch(deletePlayer(this.props.playerToEdit.uid));
    }

    onReject() {
        this.setState(() => {
            return {
                modalVisible: false
            };
        });
    }

    onDeleteButtonPressed() {

        this.setState(() => {
            return {
                modalVisible: true
            };
        });
    }

    render() {
        return (
            <Card>
                <PlayerForm {...this.props} />

                <CardSection>
                    <Button onPress={this.onButtonPressed}>Update Player</Button>
                </CardSection>

                <CardSection>
                    <Button onPress={this.onDeleteButtonPressed}>Delete</Button>
                </CardSection>

                <ConfirmModal
                    isVisible={this.state.modalVisible}
                    onConfirm={this.onConfirm}
                    onReject={this.onReject}
                >
                    Are you sure you do not want to play?
                </ConfirmModal>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    const { name, gender, skill_level, sport_type, message } = state.playerForm;

    return {
        name,
        gender,
        skill_level,
        sport_type,
        message
    }
};

export default connect(mapStateToProps)(EditPlayer);