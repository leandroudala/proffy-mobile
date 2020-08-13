import React, { useState } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import api from '../../services/api'

import PageHeader from '../../components/PageHeader'

import styles from './styles'
import TeacherItem, {Teacher} from '../../components/TeacherItem'
import { useFocusEffect } from '@react-navigation/native'



function TeacherList() {
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [favorites, setFavorites] = useState<Number[]>([])
    const [subject, setSubject] = useState('')
    const [week_day, setWeekDay] = useState('')
    const [time, setTime] = useState('')

    const [isFiltersVisible, setIsFilterVisible] = useState(false)

    function handleToggleFiltersVisible(){
        setIsFilterVisible(!isFiltersVisible)
    }

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(res => {
            if (res) {
                const favoritedTeachers = JSON.parse(res)
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher )=> {
                    return teacher.id
                })
                setFavorites(favoritedTeachersIds) 
            }
        })
    }

    async function handleFiltersSubmit() {
        loadFavorites()
        const res = await api.get('class', { 
            params: {
                subject, week_day, time
            }
        } )
        setTeachers(res.data)
        handleToggleFiltersVisible()
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible} >
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                )}
            >

                {isFiltersVisible &&
                    (
                        <View style={styles.searchForm}>
                            <Text style={styles.label}>Matéria</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Qual a matéria?"
                                placeholderTextColor="#c1bccc"
                                value={subject}
                                onChangeText={text => setSubject(text) }
                            />
                            <View style={styles.inputGroup}>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Dia da semana</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Qual o dia?"
                                        placeholderTextColor="#c1bccc"
                                        value={week_day}
                                        onChangeText={text => setWeekDay(text) }
                                    />
                                </View>

                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Horário</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Qual o horário?"
                                        placeholderTextColor="#c1bccc"
                                        value={time}
                                        onChangeText={text => setTime(text) }
                                    />
                                </View>
                            </View>

                            <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                                <Text style={styles.submitButtonText}>Filtrar</Text>
                            </RectButton>
                        </View>
                    )
                }
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                { teachers.map(teacher => (
                    <TeacherItem 
                        key={`teacher_${teacher.id}`}
                        favorited={favorites.includes(teacher.id)}
                        teacher={teacher} 
                    />
                ))}
            </ScrollView>
        </View>
    )
}
export default TeacherList
