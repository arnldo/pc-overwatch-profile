const { Plugin } = require('powercord/entities')
const { TabBar } = require('powercord/components')

const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')
const { get } = require('powercord/http')

const Profile = require('./components/Profile')

module.exports = class OverwatchProfile extends Plugin {
    constructor () {
        super()
        this.ConnectedProfile = this.settings.connectStore(Profile)
    }

    async startPlugin() {
        const _this = this
        
        const { tabBarItem } = await getModule(['tabBarItem'])
        const UserProfileBody = await this._getUserProfileBody()

        this.loadStylesheet('style.css')

        inject('user-profile-update', UserProfileBody.prototype, 'componentDidUpdate', async function (_, res) {
            const { user, connectedAccounts } = this.props
           
            if (!user || user.bot || !connectedAccounts) return

            const account = connectedAccounts.find(acc => { return acc.type === 'battlenet' })
            
            if (account) {
                const stats = await _this.fetchStats(account.name)
                this.setState({ _stats: stats })
            }
        })

        inject('user-profile-tab-bar', UserProfileBody.prototype, 'renderTabBar', function (_, res) {
            const { user } = this.props
    
            if (!res || !user || user.bot || !this.state._stats) return res
    
            const statsTab = React.createElement(TabBar.Item, {
                key: 'OVERWATCH_PROFILE',
                className: tabBarItem,
                id: 'OVERWATCH_PROFILE'
            }, 'Overwatch Profile')
    
            res.props.children.props.children.push(statsTab)
    
            return res
        })

        inject('user-profile-body', UserProfileBody.prototype, 'render', function (_, res) {
            const { children } = res.props
            const { section } = this.props
      
            if (section !== 'OVERWATCH_PROFILE') return res
      
            const body = children.props.children[1]
            body.props.children = []
      
            body.props.children.push(React.createElement(_this.ConnectedProfile, { stats: this.state._stats }))
      
            return res
        })
    }

    pluginWillUnload() {
        uninject('user-profile-tab-bar')
        uninject('user-profile-body')
        uninject('user-profile-update')
    }

    async fetchStats(battleTag) {
        return await get(`https://ow-api.com/v1/stats/pc/eu/${battleTag.replace('#', '-')}/complete`).then(r => r.body)
    }

    async _getUserProfileBody () {
        const UserProfile = await getModuleByDisplayName('UserProfile')
        const VeryDecoratedUserProfileBody = UserProfile.prototype.render().type
        const DecoratedUserProfileBody = this._extractFromFlux(VeryDecoratedUserProfileBody).render().type
        return DecoratedUserProfileBody.prototype.render.call({ props: { forwardedRef: null } }).type
    }

    _extractFromFlux (FluxContainer) {
        return FluxContainer.prototype.render.call({ memoizedGetStateFromStores: () => null }).type
    }
}
