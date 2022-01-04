<?php

declare(strict_types=1);

use Rector\Core\Configuration\Option;
use Rector\Symfony\Set\SymfonySetList;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Rector\Set\ValueObject\SetList;


return static function (ContainerConfigurator $containerConfigurator): void {
    // region Symfony Container
    $parameters = $containerConfigurator->parameters();
    $parameters->set(Option::PATHS, [
        __DIR__ . '/app',
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ]);
    // $parameters->set(
    //     Option::SYMFONY_CONTAINER_XML_PATH_PARAMETER,
    //     __DIR__ . '/var/cache/dev/App_KernelDevDebugContainer.xml'
    // );
    // endregion

    //$containerConfigurator->import(SetList::PHP_81);

    $containerConfigurator->import(SymfonySetList::SYMFONY_43);

    // $containerConfigurator->import(SymfonySetList::SYMFONY_60);
    // $containerConfigurator->import(SymfonySetList::SYMFONY_CODE_QUALITY);
    // $containerConfigurator->import(SymfonySetList::SYMFONY_CONSTRUCTOR_INJECTION);
    // $containerConfigurator->import(SymfonySetList::ANNOTATIONS_TO_ATTRIBUTES);
};
