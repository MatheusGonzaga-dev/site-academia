import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Dumbbell, 
  Download,
  X,
  Trophy,
  Target,
  Timer
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Workout } from '@/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface WorkoutReportProps {
  workout: Workout;
  startTime: Date;
  endTime: Date;
  onClose: () => void;
  onDownload?: () => void;
}

export function WorkoutReport({ workout, startTime, endTime, onClose, onDownload }: WorkoutReportProps) {
  console.log('📊 WorkoutReport renderizado!', { 
    workout: workout.name, 
    startTime: startTime.toISOString(), 
    endTime: endTime.toISOString() 
  });
  
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // em minutos
  
  const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const completedSets = workout.exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.completed).length, 0
  );
  
  const totalReps = workout.exercises.reduce((total, exercise) => 
    total + exercise.sets.reduce((exerciseTotal, set) => 
      exerciseTotal + (set.completed ? set.reps : 0), 0
    ), 0
  );

  const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const generateReportText = () => {
    const report = `
RELATÓRIO DE TREINO
==================

Data: ${format(workout.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
Treino: ${workout.name}
Duração: ${duration} minutos

ESTATÍSTICAS GERAIS:
- Séries completadas: ${completedSets}/${totalSets} (${completionRate}%)
- Total de repetições: ${totalReps}
- Exercícios realizados: ${workout.exercises.length}

DETALHES POR EXERCÍCIO:
${workout.exercises.map((exercise, index) => `
${index + 1}. ${exercise.name}
   - Séries: ${exercise.sets.filter(set => set.completed).length}/${exercise.sets.length}
   - Repetições: ${exercise.sets.reduce((total, set) => total + (set.completed ? set.reps : 0), 0)}
   - Grupo muscular: ${exercise.targetMuscle}
`).join('')}

Parabéns pelo treino! 💪
    `.trim();
    
    return report;
  };

  const handleDownload = async () => {
    try {
      console.log('📊 Iniciando geração do PDF...');
      
      // Criar um elemento temporário com o conteúdo do relatório
      const reportElement = document.createElement('div');
      reportElement.style.padding = '20px';
      reportElement.style.backgroundColor = 'white';
      reportElement.style.fontFamily = 'Arial, sans-serif';
      reportElement.style.width = '800px';
      reportElement.style.position = 'absolute';
      reportElement.style.top = '-9999px';
      
      reportElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">🏆 RELATÓRIO DE TREINO</h1>
          <p style="color: #666; margin: 0;">Parabéns pela dedicação! 💪</p>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="margin-bottom: 15px; color: #374151;">📊 Resumo do Treino</h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${duration}</div>
              <div style="font-size: 14px; color: #6b7280;">minutos</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${completedSets}/${totalSets}</div>
              <div style="font-size: 14px; color: #6b7280;">séries</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #a855f7;">${totalReps}</div>
              <div style="font-size: 14px; color: #6b7280;">repetições</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #ea580c;">${completionRate}%</div>
              <div style="font-size: 14px; color: #6b7280;">conclusão</div>
            </div>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="margin-bottom: 15px; color: #374151;">📋 Detalhes do Treino</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div><strong>Treino:</strong> ${workout.name}</div>
            <div><strong>Data:</strong> ${format(workout.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</div>
            <div><strong>Exercícios:</strong> ${workout.exercises.length}</div>
            <div><strong>Status:</strong> ✅ Concluído</div>
          </div>
        </div>
        
        <div>
          <h2 style="margin-bottom: 15px; color: #374151;">🏋️ Exercícios Realizados</h2>
          ${workout.exercises.map((exercise, index) => {
            const completedSetsCount = exercise.sets.filter(set => set.completed).length;
            const totalRepsExercise = exercise.sets.reduce((total, set) => total + (set.completed ? set.reps : 0), 0);
            
            return `
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: bold; margin-bottom: 5px;">${index + 1}. ${exercise.name}</div>
                  <div style="color: #6b7280; font-size: 14px;">${exercise.targetMuscle}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: bold;">${completedSetsCount}/${exercise.sets.length} séries</div>
                  <div style="color: #6b7280; font-size: 14px;">${totalRepsExercise} repetições</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Relatório gerado automaticamente em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
        </div>
      `;
      
      document.body.appendChild(reportElement);
      
      // Capturar o elemento como canvas
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Remover elemento temporário
      document.body.removeChild(reportElement);
      
      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Adicionar páginas extras se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Salvar PDF
      pdf.save(`relatorio-treino-${format(workout.date, 'yyyy-MM-dd')}.pdf`);
      
      console.log('✅ PDF gerado com sucesso!');
      if (onDownload) onDownload();
      
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      // Fallback para texto se falhar
      const reportText = generateReportText();
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-treino-${format(workout.date, 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Treino Concluído!</h2>
              <p className="text-gray-600">Parabéns pela dedicação 💪</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resumo Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Resumo do Treino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{duration}</div>
                  <div className="text-sm text-gray-600">minutos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedSets}/{totalSets}</div>
                  <div className="text-sm text-gray-600">séries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalReps}</div>
                  <div className="text-sm text-gray-600">repetições</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{completionRate}%</div>
                  <div className="text-sm text-gray-600">conclusão</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Treino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2" />
                Detalhes do Treino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Treino:</span>
                  <span className="font-medium">{workout.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{format(workout.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Exercícios:</span>
                  <span className="font-medium">{workout.exercises.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluído
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercícios Realizados */}
          <Card>
            <CardHeader>
              <CardTitle>Exercícios Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => {
                  const completedSetsCount = exercise.sets.filter(set => set.completed).length;
                  const totalReps = exercise.sets.reduce((total, set) => total + (set.completed ? set.reps : 0), 0);
                  
                  return (
                    <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-gray-600">{exercise.targetMuscle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{completedSetsCount}/{exercise.sets.length} séries</div>
                        <div className="text-sm text-gray-600">{totalReps} repetições</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Treino salvo automaticamente
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
