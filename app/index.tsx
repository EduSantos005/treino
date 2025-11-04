import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCategoryLabel } from '../src/constants/workoutTypes';
import { getDb } from '../src/services/database';
import { storage } from '../src/services/storage';
import { useRouter } from 'expo-router';

type Set = { id: number; reps: number; weight: number };
type Exercise = { id: number; name: string; category: string; sets: Set[] };
type Workout = {
  id: number;
  date: string;
  type: string;
  name: string;
  exercises: Exercise[];
};

const getDaysAgo = (dateString: string) => {
  const today = new Date();
  const pastDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  pastDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - pastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  return `Há ${diffDays} dias`;
};

export default function HomeScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedWorkouts = await storage.getWorkouts();
      // Comparar os IDs dos treinos para evitar re-renderizações desnecessárias
      const currentWorkoutIds = workouts.map(w => w.id).sort().join(',');
      const fetchedWorkoutIds = fetchedWorkouts.map(w => w.id).sort().join(',');

      if (currentWorkoutIds !== fetchedWorkoutIds) {
        setWorkouts(fetchedWorkouts);
      } else {
        // Se os IDs são os mesmos, verificar se algum lastTrained mudou
        const hasLastTrainedChanged = fetchedWorkouts.some((fetchedW, index) => {
          const currentW = workouts[index];
          return currentW && fetchedW.id === currentW.id && fetchedW.lastTrained !== currentW.lastTrained;
        });

        if (hasLastTrainedChanged) {
          setWorkouts(fetchedWorkouts);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os treinos.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDeleteWorkout = async (workout: Workout) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o treino "${workout.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const db = getDb();
            await db.runAsync('DELETE FROM workouts WHERE id = ?;', workout.id);
            // Also delete associated sets and exercises if they are not linked to other workouts
            // For simplicity, we are only deleting the workout entry for now.
            loadData();
          }
        }
      ]
    );
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDetails}>
          {getCategoryLabel(item.type)} • {item.exercises.length} exercício(s)
        </Text>
        <Text style={styles.lastTrainedText}>Último treino: {item.lastTrained ? getDaysAgo(item.lastTrained) : 'Nunca treinado'}</Text>
      </View>
      
      <View style={styles.workoutActions}>
        <TouchableOpacity 
          onPress={() => router.push({ pathname: "/StartWorkoutScreen", params: { workout: JSON.stringify(item) } })}
          style={[styles.actionButton, styles.startButton]}
        >
          <Text style={styles.actionButtonText}>Iniciar Treino</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push({ pathname: "/AddWorkoutScreen", params: { workout: JSON.stringify(item) } })}
          style={[styles.actionButton, styles.editButton]}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleDeleteWorkout(item)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (


      <SafeAreaView style={styles.container}>


        <View style={styles.header}>


          <View>


            <Text style={styles.title}>Meus Treinos</Text>


            <View style={styles.headerLinks}>


              <TouchableOpacity onPress={() => router.push('/CalendarScreen')}>


                <Text style={styles.headerLinkText}>Histórico</Text>


              </TouchableOpacity>


              <TouchableOpacity onPress={() => router.push('/ExerciseLibraryScreen')}>


                <Text style={styles.headerLinkText}>Exercícios</Text>


              </TouchableOpacity>


            </View>


          </View>


          <TouchableOpacity 


            style={styles.addButton}


            onPress={() => router.push('/AddWorkoutScreen')}


          >


            <Text style={styles.addButtonText}>+ Novo Treino</Text>


          </TouchableOpacity>


        </View>


  


        {loading ? (


          <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />


        ) : workouts.length === 0 ? (


          <View style={styles.emptyState}>


            <Text style={styles.emptyStateText}>


              Você ainda não tem nenhum treino cadastrado


            </Text>


          </View>


        ) : (


          <FlatList


            data={workouts}


            renderItem={renderWorkoutItem}


            keyExtractor={item => item.id}


            contentContainerStyle={styles.list}


            showsVerticalScrollIndicator={false}


          />


        )}


      </SafeAreaView>


    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerLinks: {
    flexDirection: 'row',
  },
  headerLinkText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  workoutInfo: {
    marginBottom: 15,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  workoutDetails: {
    color: '#666',
    marginBottom: 8,
  },
  lastTrainedText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '500',
  },
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  startButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  loading: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});