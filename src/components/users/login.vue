<template>
<v-app>
    <v-main>
        <v-container fill-height fluid>
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="4">

                    <v-card height="400" class="elevation-2 py-10">

                        <v-card-text>
                            <form>
                                <v-text-field prepend-icon="mdi-account-circle-outline" v-model="username" label="Username" />/
                                <v-text-field v-model="password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 5 characters" counter @click:append="show = !show" prepend-icon="mdi-lock-outline" required />
                            </form>
                        </v-card-text>
                        <v-card-actions>
                            <v-row align="center" justify="space-around">
                                <v-btn text color="primary" @click="submit">Let's Go</v-btn>
                            </v-row>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</v-app>
</template>

<script>
import {
    validationMixin
} from 'vuelidate'
import {
    required,
    maxLength
} from 'vuelidate/lib/validators'
import {
    AUTH_REQUEST
} from './../../store/actions/auth'
export default {
    mixins: [validationMixin],

    validations: {
        username: {
            required,
            maxLength: maxLength(10)
        },
        password: {
            required
        }
    },

    data() {
        return {
            username: "",
            password: "",
            show: false,
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 5 || 'Min 5 characters'
            },
        }
    },

    computed: {
        // usernameErrors() {
        //     const errors = []
        //     if (!this.$v.username.$dirty) return errors;
        //     !this.$v.username.maxLength && errors.push('username must be at most 10 characters long');
        //     !this.$v.username.required && errors.push('username is required.');
        //     return errors
        // },
        // passwordErrors() {
        //     const errors = []
        //     if (!this.$v.password.$dirty) return errors;
        //     !this.$v.password.password && errors.push('Must be valid e-mail');
        //     !this.$v.password.required && errors.push('E-mail is required');
        //     return errors
        // },
    },

    methods: {
        submit() {
            let username = this.username
            let password = this.password
            this.$store.dispatch(AUTH_REQUEST, {
                    username,
                    password
                })
                .then(() => this.$router.push('/'))
                .catch(err => console.log(err))
            // this.$v.$touch()
        },
        clear() {
            // this.$v.$reset()
            this.username = ''
            this.password = ''
        },
    },
}
</script>
