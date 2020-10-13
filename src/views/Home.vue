<template>
<v-app>
    <v-card class="overflow-hidden">
        <v-app-bar color="#6A76AB" flat app shrink-on-scroll src="https://picsum.photos/1920/1080?random" fade-img-on-scroll>
            <template v-slot:img="{ props }">
                <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
            </template>
            <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title><strong class="yellow--text">{{title}}</strong></v-toolbar-title>

            <v-spacer></v-spacer>
            <v-responsive max-width="200" class="my-4">
                <v-text-field dense background-color="white" class="text--primary" rounded></v-text-field>
            </v-responsive>
        </v-app-bar>

        <!--  <v-footer app dark padless bottom fixed>
        <v-card flat tile class="flex indigo lighten-1 white--text text-center">

            <v-card-actions class="white--text">
                <v-btn v-for="icon in icons" :key="icon" class="align   -center mx-6 white--text" icon>
                    <v-icon size="24px">
                        {{ icon }}
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                {{ new Date().getFullYear() }} - <strong>XYZ, Technologies LLP</strong>
            </v-card-actions>
        </v-card>
    </v-footer> -->
        <v-navigation-drawer v-model="drawer" app dark expand-on-hover color="#6A76AB" class="white--text">

            <v-list-item class="px-2 mt-3">
                <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/women/75.jpg"></v-img>
                </v-list-item-avatar>
            </v-list-item>

            <v-divider></v-divider>

            <v-list nav shaped>
                <v-list-item link v-for="route in routes" :key="route.title" @click="navigateToRouter(route)" v-ripple="{ class: `yellow--text` }">
                    <v-list-item-action>
                        <v-icon>{{ route.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title class="text-left" primary>{{ route.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <div class="my-2">
                    <v-btn color="primary" fab x-small left dark @click="callLogout">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <!-- Sizes your content based upon application components -->
        <v-main>

            <!-- Provides the application the proper gutter -->
            <v-container fluid>

                <!-- If using vue-router -->
                <v-expand-x-transition>
                    <router-view></router-view>
                </v-expand-x-transition>
            </v-container>
        </v-main>
    </v-card>
    <v-footer app color="transparent" height="72" inset>
        <v-text-field background-color="grey lighten-1" dense flat hide-details rounded solo></v-text-field>
    </v-footer>
</v-app>
</template>

<script>
import {
    AUTH_LOGOUT
} from './../store/actions/auth'
export default {
    name: 'Home',

    data: () => ({
        icons: [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ],
        drawer: true,
        title: 'Dashboard',
        routes: [{
                title: 'Dashboard',
                icon: 'mdi-view-dashboard',
                path: '/dashboard'
            },
            {
                title: 'Products',
                icon: 'mdi-dropbox',
                path: '/products'
            },
            {
                title: 'Category',
                icon: 'mdi-shape-outline',
                path: '/category'
            },
            {
                title: 'Orders',
                icon: 'mdi-cart',
                path: '/orders'
            },
            {
                title: 'Customers',
                icon: 'mdi-account-group-outline',
                path: '/customers'
            },
            {
                title: 'Coupens',
                icon: 'mdi-tag',
                path: '/coupens'
            },
            {
                title: 'Settings',
                icon: 'mdi-settings',
                path: '/settings'
            },
        ],
    }),
    mounted() {
        this.$router.push('/dashboard')
    },
    methods: {
        navigateToRouter(router) {
            this.title = router.title
            this.$router.push({
                path: router.path
            })
        },
        callLogout() {
            this.$store.dispatch(AUTH_LOGOUT)
                .then(() => this.$router.push('/login'))
                .catch(err => console.log(err))
        }
    }
    // computed: {
    //     ...Vuex.mapState(['score'])
    // }
}
</script>

<style scoped>
.v-list-item__title:hover {
    color: rgb(255, 0, 149);
}

.v-list-item__title {

    color: yellow;
}
</style>
