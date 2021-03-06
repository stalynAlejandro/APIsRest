import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, View, StatusBar, SafeAreaView, BackHandler, Alert } from 'react-native';

import {
  CatalogProductCarteList,
  DefaultAlert,
  Spinner,
  DefaultAcceptCancelDialog,
  HeaderWithFilterAndBackComponent,
  SearchComponent,
  MenuBurguer,
  FilterBar,
  TypoGraphyNunitoBold
} from 'components';
import {
  CatalogCarteHeaderWithFilter,
  DisplayCart,
  ServerErrorAlertDialog,
  ProviderCatalogViewSelector
} from './ProductCarteCatalogScreen.UI';

import styles from './ProductCarteCatalogScreen.component.style';
import { AppState } from "store";
import { filterCatalogCarteRequestByKeyword, ISearchCatalog } from '../../store/filterCatalogCarte';
import { reloadAllDataRequested, removeError } from '../../store/providerCatalogProducts';
import { navigateToFilterCatalogCarte } from '../../store/filterCatalogCarte';
import { sendProductDisplayOrderUpdate, cancelSendProductDisplayOrderUpdate } from '../../store/providerCatalogProducts/productsCarte';
import { hideSplashScreen, navigateBack, signOutAsync } from '../../store/authentication';
import { loadConsumerOrders } from "../../store/order";
import { ProviderCatalogProductsDTO } from "../../model/DTOs";
import { ISectionHash } from '../../store/providerCatalogProducts/sections';
import { withAuthentication } from "../../HOC";
import { COLORS } from "constants";
import NavigationService from '../../navigation/NavigationService';
import { ROUTES } from 'constants';
import { BottomShadowLine } from 'shared';

const ServerErrorAlert = React.forwardRef((props, ref) => <DefaultAlert ref={ref} {...props} />);
ServerErrorAlert.displayName = 'ServerErrorAlert';

class ProductCarteCatalogScreen extends React.Component<IProps> {
  serverErrorAlertRef = React.createRef();
  state = {
    hasToDisplayClosingSessionAlert: false,
    keTePongoProviderOID: null,
    providerId:null, 
    providerTradeName:'',
    isSearchBarToggled:false,
    radioOptions: [
      { label: "Todos", value: 0 },
      { label: "Consumidos", value: 1 }
    ],
    providerCatalogListSelection: 0,
  }


  componentDidMount() {        
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      BackHandler.addEventListener('hardwareBackPress', this.backAction);
    });
    this.setState({ keTePongoProviderOID: navigation.getParam('keTePongoProviderOID') })
    this.setState({ providerId: navigation.getParam('id') })
    this.setState({ providerTradeName: navigation.getParam('tradeName') })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }
  
  backAction = () => {

    if (!this.props.navigation.isFocused()) {
      return false;
    }
    this.setState({ hasToDisplayClosingSessionAlert: true })
    return true;
  }

  renderServerError = () => {
    const { error, removeError } = this.props;
    if (!error || !error.message || error.message === "") {
      return null;
    }

    return (
      <ServerErrorAlert
        ref={ref => { this.serverErrorAlertRef = ref; }}
        isVisible={true}
        options={
          <ServerErrorAlertDialog onPress={removeError} message={error.message} />
        }
      />
    );
  }

  renderProductCarteCatalog = () => {
    const {
      error,
      sectionDictionary,
      styles,
      isLoading,
      orderLines,
      providerDictionary
    } = this.props;

    if (error) {
      return null;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <View style={styles.fillScreen}>
        <CatalogProductCarteList
        keTePongoProviderOID={this.state.keTePongoProviderOID}
        providerId = {this.state.providerId}
        providerCatalogListSelection = {this.state.providerCatalogListSelection}
          sections={sectionDictionary}
          orderLines={orderLines}
          providerDictionary={providerDictionary}
          onRef={(ref) => (this.child = ref)}
        />
      </View>
    );
  };
  
  renderHeader = () => {
    const {
      filterCatalogCarteRequestByKeyword,
      hasTodisplayFilterConstrains,
      filterCatalogOptions,
      sectionDictionary,
      allergensDictionary,
      kindsOfFoodDictionary,
      keyword,
    } = this.props;

    const isAuthorizedToImpersonate = this.props.navigation.getParam('isAuthorizedToImpersonate', false);
    return (
      <FilterBar
        onSubmit={()=>{}}
        onFilter={(text) => filterCatalogCarteRequestByKeyword(
          text
        )}
        placeholderText={"Busca Productos"}
        value={keyword}
        goBackTo={this.props.navigateBack}
        goToFilters={this.props.navigateToFilterCatalogCarte}
        />
    );
  }
  renderSubHeader = () => {
    const { radioOptions, providerCatalogListSelection } = this.state;
    return (
      <View style={styles.subHeader_container} >

          <TypoGraphyNunitoBold style={styles.subHeader_title} text={`Catálogo ${this.state.providerTradeName}`} />
          <View>
             <ProviderCatalogViewSelector
                radioOptions={radioOptions}
                providerCatalogListSelection={providerCatalogListSelection}
                onPressSelect={value =>
                  this.setState({ providerCatalogListSelection: value })
                }
             />
          </View>
          
      </View>
    );
  }
  onPressOk = () => {
    this.setState({ hasToDisplayClosingSessionAlert: false })
    this.props.navigateBack();
  }

  onPressCancel = () => this.setState({ hasToDisplayClosingSessionAlert: false });

  render() {
    const { styles } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar backgroundColor={COLORS.neutral_min} barStyle="dark-content" />
          {this.renderHeader()}
          {this.state.hasToDisplayClosingSessionAlert && <DefaultAcceptCancelDialog onPressOk={this.onPressOk}
            onPressCancel={this.onPressCancel.bind(this)} onPressOut={this.onPressCancel.bind(this)}
            text={"¿Desea salir del cátalogo?"} />}
          <View style={styles.body}>
            {this.renderSubHeader()}
            {this.renderServerError()}
            {this.renderProductCarteCatalog()}
          </View>
        </View >
      </SafeAreaView>
    );
  }
}


ProductCarteCatalogScreen.defaultProps = {
  styles
};

ProductCarteCatalogScreen.propTypes = {
  productCarteAdded: PropTypes.object,
  error: PropTypes.object,
  isloadingData: PropTypes.bool,
  filterCatalogLoading: PropTypes.bool,
  filterCatalogCarteOptions: PropTypes.object,
  sectionDictionary: PropTypes.object,
  hasTodisplayFilterConstrains: PropTypes.bool,
  filterCatalogCarteRequestByKeyword: PropTypes.func.isRequired,
  reloadAllDataRequested: PropTypes.func.isRequired,
  hideSplashScreen: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  sendProductDisplayOrderUpdate: PropTypes.func.isRequired,
  cancelSendProductDisplayOrderUpdate: PropTypes.func.isRequired,
  navigateBack:PropTypes.func.isRequired,
  navigateToFilterCatalogCarte:PropTypes.func.isRequired,
  orderLines: PropTypes.object.isRequired,
  providerDictionary: PropTypes.object,
};

const mapStateToProps = (state: AppState): IPropsFromState => {
  return {
    error: state.providerCatalogProducts.error,
    isloadingData: state.providerCatalogProducts.loading,
    isFilterCatalogLoading: state.filterCatalogCarte.loading,
    filterCatalogCarteRequestByKeyword: state.filterCatalogCarte.search,
    sectionDictionary: state.providerCatalogProducts.sections.dictionary || {},
    productsToDisplay: state.filterCatalogCarte.sections,
    filterCatalogOptions: state.filterCatalogCarte.search,
    allergensDictionary: state.providerCatalogProducts.allergens,
    kindsOfFoodDictionary: state.providerCatalogProducts.kindsOfFood,
    isFilterInitialized: state.filterCatalogCarte.isInitialized,
    keyword: state.filterCatalogCarte.search.keyword,
    orderLines: state.order.currentOrder.orderLines,
    providerDictionary: state.consumption.providers.dictionary || {},
  };
};

const mapDispatchToProps = {
  filterCatalogCarteRequestByKeyword,
  reloadAllDataRequested,
  hideSplashScreen,
  loadConsumerOrders,
  removeError,
  signOutAsync,
  sendProductDisplayOrderUpdate,
  cancelSendProductDisplayOrderUpdate,
  navigateBack,
  navigateToFilterCatalogCarte
};

interface IPropsFromState {
  error: any;
  isloadingData: boolean;
  isFilterCatalogLoading: boolean;
  filterCatalogCarteRequestByKeyword: any;
  productsToDisplay: any
  providerCatalogProducts?: ProviderCatalogProductsDTO;
  sectionDictionary: ISectionHash;
  filterCatalogOptions: ISearchCatalog
  allergensDictionary: any;
  kindsOfFoodDictionary: any;
  isFilterInitialized: Boolean;
}

interface IProps extends IPropsFromState {
  filterCatalogRequest: Function;
  reloadAllDataRequested: Function;
  hideSplashScreen: Function;
  loadConsumerOrders: Function;
  initializeProviderCatalogProducts: () => void;
  hasTodisplayFilterConstrains: boolean;
  searchText: string;
  isLoading: boolean;
  removeError: Function;
  keyword: string;
  signOutAsync: Function;
  sendProductDisplayOrderUpdate: Function;
  cancelSendProductDisplayOrderUpdate: Function;
  navigateBack:Function;
  navigateToFilterCatalogCarte:Function;
}

const mergeProps = (propsFromState: IPropsFromState, propsFromDispatch: any, ownProps: any) => {
  const {
    isFilterCatalogLoading,
    isloadingData,
    providerCatalogProducts,
    filterCatalogOptions,
    isFilterInitialized,
  } = propsFromState;

  let hasTodisplayFilterConstrains = filterCatalogOptions.keyword !== "" || filterCatalogOptions.selectedAllergens.length > 0 ||
    filterCatalogOptions.selectedSections.length > 0 || filterCatalogOptions.selectedKindsOfFood.length > 0;

  let productCarteAdded = ownProps.navigation.getParam('added_productCarte', undefined);
  if (productCarteAdded) {
    productCarteAdded = JSON.parse(productCarteAdded);
  }

  return {
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps,
    hasTodisplayFilterConstrains,
    isLoading: (isloadingData || isFilterCatalogLoading || !isFilterInitialized),
    productCarteAdded
  };
};

ProductCarteCatalogScreen = withAuthentication((connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProductCarteCatalogScreen)));

export { ProductCarteCatalogScreen };
