import React from 'react';
import { GalleryContext } from '../../context/GalleryContext.js';
import LOADING_MODE from '../../utils/constants/loadingMode';

export default class ImageItem extends React.Component {
  static contextType = GalleryContext;

  componentDidMount() {
    try {
      if (typeof this.props.actions.setItemLoaded === 'function') {
        this.props.actions.setItemLoaded();
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const {
      alt,
      displayed,
      imageDimensions,
      resized_url,
      id,
      actions,
      settings,
      styleParams,
    } = this.props;
    const imageProps =
      settings &&
      settings.imageProps &&
      typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};
    const backgroundStyle = {}; //remove this inline style if rendered padding (using css) is used
    const { marginLeft, marginTop, ...restOfDimensions } =
      imageDimensions || {};
    const isSEO = !!this.props.isInSEO;
    const imageItemClassName = [
      'gallery-item-content',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      styleParams.cubeImages && styleParams.cubeType === 'fit'
        ? 'grid-fit'
        : '',
      styleParams.imageLoadingMode === LOADING_MODE.COLOR
        ? 'load-with-color'
        : '',
    ].join(' ');
    const imageContainer = image => {
      return (
        <div
          className={imageItemClassName}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
          key={'image_container-' + id}
          data-hook={'image-item'}
          style={displayed ? {} : { ...backgroundStyle, ...restOfDimensions }}
        >
          {image}
        </div>
      );
    };
    const image = (
      <img
        key={
          (styleParams.cubeImages && styleParams.cubeType === 'fill'
            ? 'cubed-'
            : '') + 'image'
        }
        className={'gallery-item-visible gallery-item gallery-item-preloaded'}
        arial-label={alt}
        alt={alt}
        src={resized_url.seoLink}
        style={restOfDimensions}
        {...imageProps}
      />
    );
    const canvas = (
      <canvas
        key={
          (styleParams.cubeImages && styleParams.cubeType === 'fill'
            ? 'cubed-'
            : '') + 'image'
        }
        className={
          'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'
        }
        role="img"
        arial-label={alt}
        data-src={resized_url.img}
        style={restOfDimensions}
        {...imageProps}
      />
    );

    const renderedItem = isSEO ? imageContainer(image) : imageContainer(canvas);
    return renderedItem;
  }
}
