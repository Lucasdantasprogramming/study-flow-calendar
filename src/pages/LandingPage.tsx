
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, BookOpen, Clock, CheckSquare } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-study-purple/5 to-study-blue/5">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">StudyFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button>Criar Conta</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-study-purple to-study-blue bg-clip-text text-transparent">
            Organize seus estudos de forma eficiente
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Planeje seu tempo, acompanhe seu progresso e otimize seu aprendizado com a melhor plataforma de gestão de estudos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Começar Agora
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos que transformam seu estudo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calendário Inteligente</h3>
              <p className="text-gray-600">Visualize e organize suas tarefas de estudo em um calendário interativo</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rotina Personalizada</h3>
              <p className="text-gray-600">Crie uma rotina semanal adaptada ao seu estilo de aprendizado</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Anotações Práticas</h3>
              <p className="text-gray-600">Faça anotações detalhadas e acesse-as facilmente</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <CheckSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe seu Progresso</h3>
              <p className="text-gray-600">Visualize seu progresso e mantenha-se motivado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos usuários dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-4">"StudyFlow revolucionou minha forma de estudar. Agora consigo organizar melhor meu tempo e ver resultados reais."</p>
              <p className="font-semibold">Ana Silva</p>
              <p className="text-sm text-gray-500">Estudante de Medicina</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-4">"A funcionalidade de anotações me ajudou muito a reter informações importantes. Recomendo para todos os estudantes."</p>
              <p className="font-semibold">Carlos Oliveira</p>
              <p className="text-sm text-gray-500">Estudante de Engenharia</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-4">"Aumentei minha produtividade em 50% desde que comecei a usar o StudyFlow. A interface é intuitiva e as funções são completas."</p>
              <p className="font-semibold">Mariana Costa</p>
              <p className="text-sm text-gray-500">Concurseira</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-study-purple to-study-blue text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece a transformar seus estudos hoje</h2>
          <p className="text-xl mb-8 text-white/80">Junte-se a milhares de estudantes que já otimizaram sua rotina de estudos</p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
              Criar conta gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="text-2xl font-bold">StudyFlow</span>
              <p className="mt-2 text-gray-400">A melhor plataforma para organizar seus estudos</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
                <ul className="space-y-2">
                  <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                  <li><Link to="/signup" className="text-gray-400 hover:text-white">Cadastro</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Recursos</h3>
                <ul className="space-y-2">
                  <li><span className="text-gray-400">Calendário</span></li>
                  <li><span className="text-gray-400">Rotina Diária</span></li>
                  <li><span className="text-gray-400">Anotações</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><span className="text-gray-400">Política de Privacidade</span></li>
                  <li><span className="text-gray-400">Termos de Uso</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} StudyFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
