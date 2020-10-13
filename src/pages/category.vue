<template>
<v-app class="grey lighten-2">
    <v-dialog v-model="dialog" fullscreen transition="fab-transition">

        <v-row class="transparent">
            <v-col cols="12" sm="3">

            </v-col>

            <v-col cols="12" sm="1">

                <v-btn icon color="white" class="align-right ml-15">
                    <v-icon @click="dialog = false" color="red">mdi-close-circle</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="12" sm="8" class="grey lighten-2">
                <v-row>
                    <strong class="ma-5">Add Category</strong>

                </v-row>
                <v-row>
                    <v-col>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-row>
                                    <v-responsive max-width="250" class="mx-auto mt-2">
                                        <span class="mt-3 justify-center">Upload your Category image here</span>
                                    </v-responsive>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-row>
                                    <v-col cols="12">
                                        <DropZone></DropZone>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-row>
                                    <v-responsive max-width="250" class="mx-auto mt-2">
                                        <span class="mt-3 justify-center">Add your category description and necessary informations from here</span>
                                    </v-responsive>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="pa-2">
                                    <v-row>
                                        <v-responsive max-width="400" class="mx-auto">
                                            <v-text-field persistent-hint label="Category Name*" dense background-color="grey lighten-1" outlined required></v-text-field>
                                        </v-responsive>
                                    </v-row>
                                    <v-row>
                                        <v-responsive max-width="400" class="mx-auto">
                                            <v-text-field persistent-hint label="Slug*" dense background-color="grey lighten-1" outlined required></v-text-field>
                                        </v-responsive>

                                    </v-row>

                                    <v-row>
                                        <v-responsive max-width="400" class="mx-auto">
                                            <v-select dense return-object outlined background-color="grey lighten-1" :items="['0-17', '18-29', '30-54', '54+']" label="Ex: Choose parent category*" required></v-select>
                                        </v-responsive>

                                    </v-row>
                                    <small>*indicates required field</small>
                                </div>

                            </v-col>
                        </v-row>

                    </v-col>

                </v-row>
                <v-row class="white">
                    <v-col cols="12" md="6">
                        <v-btn color="blue darken-3" text @click="dialog = false">
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col class="primary" cols="12" md="6">
                        <v-btn color="blue darken-4" text @click="dialog = false">
                            Create Category
                        </v-btn>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>

    </v-dialog>
    <v-container class="grey lighten-2">
        <!-- Provides the application the proper gutter -->

        <v-row class="mb-6 mt-10" no-gutters>
            <v-responsive>
                <v-card width="100%" tile outlined>
                    <v-container fluid>
                        <v-row class="mx-auto align-baseline">
                            <v-col cols="2">
                                <strong class="body" background-color="primary">Category</strong>
                            </v-col>
                            <v-col cols="2">
                                <v-responsive max-width="500">
                                    <v-select label="Category Type" v-model="categoryTypeSelected" dense solo :items="['0-17', '18-29', '30-54', '54+']" required></v-select>
                                </v-responsive>
                            </v-col>
                            <v-col cols="6">
                                <v-responsive max-width="400" class="mx-auto">
                                    <v-text-field v-model="categoryNameSearch" label="Ex: Search by Name" dense background-color="white lighten-1" outlined solo flat required></v-text-field>
                                </v-responsive>
                            </v-col>
                            <v-col cols="2">
                                <v-responsive>
                                    <v-btn max-width="500" class="mx-auto" @click="dialog = !dialog" color="primary">
                                        <v-icon left color="white">
                                            mdi-plus
                                        </v-icon>Add Category
                                    </v-btn>
                                </v-responsive>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-responsive>

        </v-row>

        <v-row class="mb-6" no-gutters>
            <v-col>
                <v-card class="mx-auto" tile outlined>
                    <v-data-table v-model="selected" :search="CategoryTableSearch" show-select :headers="headers" :items="CategoryTable" :items-per-page="5" class="elevation-1">
                        <template v-slot:item.actions="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary" @click="initialize">
                                Reset
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</v-app>
</template>

<script>
// @ is an alias to /src
import DropZone from '@/components/dragNdrop.vue'
export default {
    components: {
        DropZone
    },
    data() {
        return {
            dialog: false,
            CategoryTableSearch: '',
            categoryNameSearch: '',
            categoryTypeSelected: {},
            categoryType: [{
                    id: 1,
                    name: 'Grocery',
                },
                {
                    id: 2,
                    name: 'Women Cloths',
                },
                {
                    id: 3,
                    name: 'Bags',
                },
                {
                    id: 4,
                    name: 'Makeups',
                }
            ],
            headers: [{
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                {
                    text: 'Image',
                    value: 'calories'
                },
                {
                    text: 'Name',
                    value: 'fat'
                },
                {
                    text: 'Slug',
                    value: 'carbs'
                },
                {
                    text: 'Type',
                    value: 'protein'
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            selected: [],
            Category: [{
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%',
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: '1%',
                },
                {
                    name: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: '7%',
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: '8%',
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: '16%',
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: '0%',
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%',
                },
                {
                    name: 'Honeycomb',
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                    iron: '45%',
                },
                {
                    name: 'Donut',
                    calories: 452,
                    fat: 25.0,
                    carbs: 51,
                    protein: 4.9,
                    iron: '22%',
                },
                {
                    name: 'KitKat',
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                    iron: '6%',
                },

            ],
        }
    },

    watch: {
        categoryNameSearch(val) {
            this.CategoryTableSearch = val
        },
        categoryTypeSelected(val) {
            this.CategoryTableSearch = val
        },

    },
    computed: {
        CategoryTable() {
            let tempTable = this.Category
            return tempTable
        }
    },
    methods: {
        editItem() {
            this.dialog = true
        },
        deleteItem() {

        }
    },
}
</script>
