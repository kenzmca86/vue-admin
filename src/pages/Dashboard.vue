<template>
<v-app class="grey lighten-2">

    <v-row class="px-5">
        <template v-for="n in 4">
            <v-col :key="n" class="mt-2" cols="12">
                <strong>Category {{ n }}</strong>
            </v-col>

            <v-col v-for="j in 6" :key="`${n}${j}`" cols="6" md="2">
                <v-sheet height="150"></v-sheet>
            </v-col>
        </template>
    </v-row>
</v-app>
</template>
