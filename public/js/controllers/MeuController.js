angular.module('meuApp').controller('MeuController', function ($scope, $http) {
  $scope.listaCompras = [];
  $scope.ErroInclusao = '';
  $scope.carregarCompras = function () {
    $http(
      {
        url: 'compras.json',
        method: 'GET'
      }).then(function (response) {
        $scope.listaCompras = response.data;
      })
  }
  $scope.carregarCompras();
  $scope.adicionarCompra = function () {
    $scope.ErroInclusao = '';
    // Campos obrigatórios
    var item = $scope.frmCompras.item;
    var quantia = $scope.frmCompras.quantia;

    // Valida se a quantidade é um número inteiro
    if (quantia < 1) {
      $scope.ErroInclusao = 'A quantitidade precisa ser no mínimo 1.';
      return;
    }
    // Verifica se todos os campos estão preenchidos
    if (!item || !quantia) {
      $scope.ErroInclusao = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    // Se passou por todas as validações, prossegue com o cadastro
    $scope.listaCompras.push({
      "item": item,
      "quantia": quantia
    });

    // Envia os dados para o servidor
    $http({
      url: '/addCompras',
      method: 'POST',
      data: {
        "item": item,
        "quantia": quantia
      }
    }).then(function (response) {
      console.log(response.data); // Mensagem de sucesso
    }).catch(function (error) {
      $scope.ErroInclusao = 'Erro ao adicionar a compra: ' + error.message;
    });

    // Limpa o formulário após adicionar
    $scope.frmCompras = {
      "item": "",
      "quantia": ""
    };
  };
  $scope.mostrarModalConfirmacao = false;
  $scope.itemParaExcluir = null;
  $scope.excluirCompra = function (item) {
    $scope.itemParaExcluir = item;
    $scope.mostrarModalConfirmacao = true; // Mostra o modal
  };
  $scope.confirmarExclusao = function () {
    $http({
      url: '/deleteCompra',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      data: { item: $scope.itemParaExcluir }
    }).then(function (response) {
      $scope.carregarCompras();  // Atualiza a lista após exclusão

      // Exibe o aviso de exclusão
      $scope.exclusaoAviso = true;

      // Oculta o modal
      $scope.mostrarModalConfirmacao = false;
      $scope.itemParaExcluir = null;

      // Após 3 segundos, ocultar a div novamente
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.exclusaoAviso = false;
        });
      }, 3000);

    }).catch(function (error) {
      $scope.ErroExclusao = error.data || 'Erro ao excluir a compra.';
      alert($scope.ErroExclusao);
    });
  };
  $scope.cancelarExclusao = function () {
    $scope.mostrarModalConfirmacao = false; // Oculta o modal
    $scope.itemParaExcluir = null;
  };
  $scope.mostrarDetalhes = false;
  $scope.abrirDetalhes = function (compra) {
    $scope.compraDetalhes = compra; // Define os detalhes da compra
    $scope.mostrarDetalhes = true; // Exibe o modal
  };
  $scope.fecharDetalhes = function () {
    $scope.mostrarDetalhes = false; // Esconde o modal
  };
  $scope.editarDetalhes = function (compraDetalhes) {
    var item = compraDetalhes.item;
    var quantia = compraDetalhes.quantia;
    var descricao = compraDetalhes.descricao;

    // Valida se a quantidade é um número inteiro
    if (quantia < 1) {
      $scope.ErroInclusao = 'A quantidade precisa ser no mínimo 1.';
      return;
    }

    // Verifica se todos os campos estão preenchidos
    if (!item || !quantia) {
      $scope.ErroInclusao = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    // Atualiza o item na lista localmente (opcional)
    var compraIndex = $scope.listaCompras.findIndex(c => c.item === compraDetalhes.item);
    if (compraIndex > -1) {
      $scope.listaCompras[compraIndex] = {
        item: item,
        quantia: quantia,
        descricao: descricao
      };
    }

    // Fazendo a requisição PUT para atualizar o recurso no servidor
    $http({
      url: '/updateCompra/' + encodeURIComponent(item),  // URL com o identificador do item
      method: 'PUT',
      data: {
        item: item,
        quantia: quantia,
        descricao: descricao
      }
    }).then(function (response) {
      console.log('Compra atualizada com sucesso:', response.data); // Mensagem de sucesso
    }).catch(function (error) {
      $scope.ErroInclusao = 'Erro ao atualizar a compra: ' + error.message;
    });

    // Fechar o modal após a edição
    $scope.fecharDetalhes();

  };
  $scope.ajustarAltura = function(event) {
    const element = event.target;
    
    // Redefine a altura para o mínimo e depois ajusta
    element.style.height = 'auto';
    element.style.height = (element.styleHeight) + 10;
    
    // Ajusta a altura de acordo com o conteúdo
    element.style.height = (element.scrollHeight) + 'px';
  };
  
});
