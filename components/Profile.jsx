const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')

const AsyncComponent = require('powercord/components/AsyncComponent')
const { Spinner, Text, Flex } = require('powercord/components')

const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'))

const { AdvancedScrollerThin } = getModule(['AdvancedScrollerThin'], false)

class Section extends React.PureComponent {
    constructor(props) {
        super(props)
    
        this.classes = {
            ...getModule(['marginBottom8'], false),
        }
    }
  
    render() {
        const { children, title } = this.props
    
        if (!children) return null
    
        return (
            <FormSection className={this.classes.marginBottom8 + ' stats-section'} tag='h5' title={title}>
                <Text selectable={true}>{children}</Text>
            </FormSection>
        )
    }
}

module.exports = class Profile extends React.PureComponent {
    constructor(props) {
        super(props)
  
        this.classes = {
            empty: getModule(['body', 'empty'], false).empty,
            ...getModule(['emptyIcon'], false),
        }
    }
  
    render() {
        const { stats } = this.props
  
        if (!stats) {
            return (
                <div className={this.classes.empty}>
                    <Spinner />
                </div>
            )
        } else {
            const level = (stats.prestige * 100) + stats.level
            
            if (stats.private != true) {
                return (
                    <AdvancedScrollerThin className='overwatch-profile' fade={true}>
                        <Flex justify={Flex.Justify.START} wrap={Flex.Wrap.WRAP}>
                            <Section title='Name'>{stats.name}</Section>
                            <Section title='Level'>{level}</Section>
                            <Section title='Endorsement Level'>{stats.endorsement}</Section>
                            <Section title='Games Won'>{stats.gamesWon}</Section>
                        </Flex>

                        <Flex justify={Flex.Justify.START} wrap={Flex.Wrap.WRAP}>
                            <Section title='Quick Play Stats'>
                                <Flex justify={Flex.Justify.START} wrap={Flex.Wrap.WRAP}>
                                    <Section title='Time Played'>{stats.quickPlayStats.careerStats.allHeroes.game.timePlayed}</Section>
                                    <Section title='Games Played'>{stats.quickPlayStats.careerStats.allHeroes.game.gamesPlayed}</Section>
                                    <Section title='Games Won'>{stats.quickPlayStats.careerStats.allHeroes.game.gamesWon}</Section>
                                    <Section title='Top Heroes'></Section>
                                </Flex>
                            </Section>
                        </Flex>


                        <Flex justify={Flex.Justify.START} wrap={Flex.Wrap.WRAP}>
                            <Section title='Competitive Stats'>
                                <Flex justify={Flex.Justify.START} wrap={Flex.Wrap.WRAP}>
                                    <Section title='Time Played'>{stats.competitiveStats.careerStats.allHeroes.game.timePlayed}</Section>
                                    <Section title='Games Played'>{stats.competitiveStats.careerStats.allHeroes.game.gamesPlayed}</Section>
                                    <Section title='Games Won'>{stats.competitiveStats.careerStats.allHeroes.game.gamesWon}</Section>
                                    <Section title='Rating'><img width='35' height='35' src={stats.ratingIcon}></img>{stats.rating}</Section>
                                </Flex>
                            </Section>
                        </Flex>
                    </AdvancedScrollerThin>
                )
            } else {
                return (
                    <AdvancedScrollerThin className='overwatch-profile' fade={true}>
                        <Flex justify={Flex.Justify.START} wrap={Flex.Wrap.WRAP}>
                            <Section title='Name'>{stats.name}</Section>
                            <Section title='Level'>{level}</Section>
                            <Section title='Endorsement Level'>{stats.endorsement}</Section>
                        </Flex>
                    </AdvancedScrollerThin>
                )
            }
        }
    }
}